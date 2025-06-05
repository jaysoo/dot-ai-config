#!/usr/bin/env node

/**
 * Sync Engine Prototype
 * 
 * This script demonstrates the bidirectional synchronization system
 * between the Nx CLI repo, Nx Cloud repo, and Raw Docs repo
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Configuration for the three-repository sync system
 */
const SYNC_CONFIG = {
  repositories: {
    nxCli: {
      name: 'nx-cli',
      path: '/path/to/nx-cli',
      docsPath: 'docs/',
      apiDocsPath: 'docs/generated/',
      priority: 'high'
    },
    nxCloud: {
      name: 'nx-cloud',
      path: '/path/to/nx-cloud', 
      docsPath: 'docs/',
      priority: 'high'
    },
    rawDocs: {
      name: 'nx-raw-docs',
      path: '/path/to/nx-raw-docs',
      priority: 'source-of-truth'
    }
  },
  syncMappings: {
    // CLI repo mappings
    'packages/*/README.md': 'features/nx-cli/{package}/readme.md',
    'packages/*/src/generators/*/schema.json': 'api/cli-api/generators/{generator}.json',
    'packages/*/src/executors/*/schema.json': 'api/cli-api/executors/{executor}.json',
    'docs/generated/cli/*.md': 'api/cli-api/commands/{command}.md',
    'docs/shared/*.md': 'guides/cross-platform/{file}.md',
    
    // Cloud repo mappings  
    'docs/features/*.md': 'features/nx-cloud/{feature}.md',
    'docs/api/*.md': 'api/cloud-api/{endpoint}.md',
    'CHANGELOG.md': 'changelog/cloud-changes.md',
    
    // Bidirectional mappings
    'features/nx-cli/': 'docs/packages/',
    'features/nx-cloud/': 'docs/cloud-features/',
    'guides/cross-platform/': 'docs/shared/'
  }
};

/**
 * Represents a change that needs to be synchronized
 */
class SyncChange {
  constructor(type, sourceRepo, targetRepo, sourcePath, targetPath, content, metadata = {}) {
    this.id = generateChangeId();
    this.type = type; // 'create', 'update', 'delete', 'move'
    this.sourceRepo = sourceRepo;
    this.targetRepo = targetRepo;
    this.sourcePath = sourcePath;
    this.targetPath = targetPath;
    this.content = content;
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();
    this.status = 'pending'; // 'pending', 'applied', 'failed', 'conflicted'
    this.conflicts = [];
  }
  
  toString() {
    return `${this.type.toUpperCase()}: ${this.sourceRepo}:${this.sourcePath} → ${this.targetRepo}:${this.targetPath}`;
  }
}

/**
 * Main synchronization engine
 */
class SyncEngine {
  constructor(config = SYNC_CONFIG) {
    this.config = config;
    this.changeQueue = [];
    this.conflictResolvers = new Map();
    this.lastSyncTimes = new Map();
    
    // Register default conflict resolvers
    this.registerConflictResolver('content-merge', this.mergeContentConflict.bind(this));
    this.registerConflictResolver('timestamp-priority', this.timestampPriorityResolver.bind(this));
    this.registerConflictResolver('source-priority', this.sourcePriorityResolver.bind(this));
  }
  
  /**
   * Detect changes that need synchronization
   */
  async detectChanges(repositoryName, sinceTime = null) {
    console.log(`🔍 Detecting changes in ${repositoryName}...`);
    
    const repo = this.config.repositories[repositoryName];
    if (!repo) {
      throw new Error(`Unknown repository: ${repositoryName}`);
    }
    
    const changes = [];
    const since = sinceTime || this.lastSyncTimes.get(repositoryName) || new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    try {
      // Get git changes since last sync
      const gitChanges = this.getGitChangesSince(repo.path, since);
      
      // Map git changes to sync changes
      for (const gitChange of gitChanges) {
        const syncChanges = this.mapGitChangeToSyncChanges(repositoryName, gitChange);
        changes.push(...syncChanges);
      }
      
      console.log(`   Found ${changes.length} changes requiring sync`);
      return changes;
      
    } catch (error) {
      console.error(`Error detecting changes in ${repositoryName}:`, error.message);
      return [];
    }
  }
  
  /**
   * Get git changes since a specific time
   */
  getGitChangesSince(repoPath, since) {
    try {
      const sinceStr = since.toISOString().split('T')[0];
      const output = execSync(
        `cd "${repoPath}" && git log --since="${sinceStr}" --name-status --pretty=format:"COMMIT:%H|%s|%ai"`,
        { encoding: 'utf8' }
      );
      
      return this.parseGitOutput(output);
    } catch (error) {
      console.warn(`Could not get git changes for ${repoPath}:`, error.message);
      return [];
    }
  }
  
  /**
   * Parse git log output into structured changes
   */
  parseGitOutput(output) {
    const changes = [];
    const lines = output.split('\n').filter(Boolean);
    let currentCommit = null;
    
    for (const line of lines) {
      if (line.startsWith('COMMIT:')) {
        const [, hash, subject, date] = line.split('|');
        currentCommit = { hash, subject, date, files: [] };
        changes.push(currentCommit);
      } else if (currentCommit && /^[ADM]\t/.test(line)) {
        const [status, file] = line.split('\t');
        currentCommit.files.push({ status, file });
      }
    }
    
    return changes;
  }
  
  /**
   * Map git changes to sync changes based on sync mappings
   */
  mapGitChangeToSyncChanges(sourceRepo, gitChange) {
    const syncChanges = [];
    
    for (const fileChange of gitChange.files) {
      const targetMappings = this.findSyncMappings(sourceRepo, fileChange.file);
      
      for (const mapping of targetMappings) {
        const changeType = this.gitStatusToChangeType(fileChange.status);
        const content = this.getFileContent(sourceRepo, fileChange.file);
        
        const syncChange = new SyncChange(
          changeType,
          sourceRepo,
          mapping.targetRepo,
          fileChange.file,
          mapping.targetPath,
          content,
          {
            commit: gitChange.hash,
            subject: gitChange.subject,
            date: gitChange.date
          }
        );
        
        syncChanges.push(syncChange);
      }
    }
    
    return syncChanges;
  }
  
  /**
   * Find sync mappings for a file path
   */
  findSyncMappings(sourceRepo, filePath) {
    const mappings = [];
    
    for (const [pattern, targetPattern] of Object.entries(this.config.syncMappings)) {
      if (this.matchesPattern(filePath, pattern)) {
        const targetPath = this.applyPatternMapping(filePath, pattern, targetPattern);
        const targetRepo = this.determineTargetRepo(sourceRepo, targetPath);
        
        mappings.push({
          targetRepo,
          targetPath,
          pattern,
          targetPattern
        });
      }
    }
    
    return mappings;
  }
  
  /**
   * Check if a file path matches a pattern
   */
  matchesPattern(filePath, pattern) {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '([^/]+)')
      .replace(/\//g, '\\/')
      .replace(/\./g, '\\.');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  }
  
  /**
   * Apply pattern mapping to transform source path to target path
   */
  applyPatternMapping(sourcePath, sourcePattern, targetPattern) {
    const regexPattern = sourcePattern
      .replace(/\*/g, '([^/]+)')
      .replace(/\//g, '\\/')
      .replace(/\./g, '\\.');
    
    const regex = new RegExp(`^${regexPattern}$`);
    const matches = sourcePath.match(regex);
    
    if (!matches) return targetPattern;
    
    let result = targetPattern;
    matches.slice(1).forEach((match, index) => {
      result = result.replace(`{${this.getPlaceholderName(sourcePattern, index)}}`, match);
    });
    
    return result;
  }
  
  /**
   * Get placeholder name for pattern mapping
   */
  getPlaceholderName(pattern, index) {
    const placeholders = ['package', 'feature', 'generator', 'executor', 'command', 'file', 'endpoint'];
    return placeholders[index] || `match${index}`;
  }
  
  /**
   * Determine target repository for a mapped path
   */
  determineTargetRepo(sourceRepo, targetPath) {
    if (targetPath.startsWith('features/nx-cli/')) return 'nxCli';
    if (targetPath.startsWith('features/nx-cloud/')) return 'nxCloud';
    return 'rawDocs'; // Default to raw docs repo
  }
  
  /**
   * Convert git status to change type
   */
  gitStatusToChangeType(gitStatus) {
    const mapping = { 'A': 'create', 'M': 'update', 'D': 'delete' };
    return mapping[gitStatus] || 'update';
  }
  
  /**
   * Get file content (mock implementation)
   */
  getFileContent(repo, filePath) {
    // In real implementation, this would read from the actual repository
    return `// Content of ${filePath} from ${repo}`;
  }
  
  /**
   * Apply changes with conflict detection and resolution
   */
  async applyChanges(changes) {
    console.log(`🔄 Applying ${changes.length} changes...`);
    
    const results = {
      applied: 0,
      failed: 0,
      conflicted: 0,
      conflicts: []
    };
    
    for (const change of changes) {
      try {
        const conflictDetected = await this.detectConflicts(change);
        
        if (conflictDetected.length > 0) {
          change.conflicts = conflictDetected;
          change.status = 'conflicted';
          results.conflicted++;
          results.conflicts.push(change);
          
          console.log(`   ⚠️  Conflict detected: ${change.toString()}`);
          
          // Attempt automatic conflict resolution
          const resolved = await this.resolveConflicts(change);
          if (resolved) {
            await this.applyChange(change);
            change.status = 'applied';
            results.applied++;
            console.log(`   ✅ Conflict resolved and applied: ${change.toString()}`);
          }
        } else {
          await this.applyChange(change);
          change.status = 'applied';
          results.applied++;
          console.log(`   ✅ Applied: ${change.toString()}`);
        }
        
      } catch (error) {
        change.status = 'failed';
        results.failed++;
        console.log(`   ❌ Failed: ${change.toString()} - ${error.message}`);
      }
    }
    
    return results;
  }
  
  /**
   * Detect conflicts for a change
   */
  async detectConflicts(change) {
    const conflicts = [];
    
    // Check if target file exists and has been modified
    const targetExists = await this.fileExists(change.targetRepo, change.targetPath);
    if (targetExists) {
      const targetLastModified = await this.getFileLastModified(change.targetRepo, change.targetPath);
      const sourceLastModified = new Date(change.metadata.date);
      
      if (targetLastModified > sourceLastModified) {
        conflicts.push({
          type: 'newer-target',
          message: 'Target file is newer than source',
          targetModified: targetLastModified,
          sourceModified: sourceLastModified
        });
      }
      
      // Check content similarity
      const targetContent = await this.getTargetFileContent(change.targetRepo, change.targetPath);
      const similarity = this.calculateContentSimilarity(change.content, targetContent);
      
      if (similarity < 0.7) { // Less than 70% similar
        conflicts.push({
          type: 'content-divergence',
          message: 'Target content has diverged significantly from source',
          similarity
        });
      }
    }
    
    return conflicts;
  }
  
  /**
   * Resolve conflicts using registered resolvers
   */
  async resolveConflicts(change) {
    for (const conflict of change.conflicts) {
      const resolver = this.conflictResolvers.get(conflict.type) || 
                      this.conflictResolvers.get('default');
      
      if (resolver) {
        const resolution = await resolver(change, conflict);
        if (resolution.action === 'skip') {
          return false;
        }
        if (resolution.action === 'merge') {
          change.content = resolution.mergedContent;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Register a conflict resolver
   */
  registerConflictResolver(type, resolver) {
    this.conflictResolvers.set(type, resolver);
  }
  
  /**
   * Content merge conflict resolver
   */
  async mergeContentConflict(change, conflict) {
    if (conflict.type !== 'content-divergence') {
      return { action: 'proceed' };
    }
    
    // Simple merge strategy: favor source content but preserve target-specific sections
    const targetContent = await this.getTargetFileContent(change.targetRepo, change.targetPath);
    const mergedContent = this.mergeDocumentationContent(change.content, targetContent);
    
    return {
      action: 'merge',
      mergedContent
    };
  }
  
  /**
   * Timestamp priority conflict resolver
   */
  async timestampPriorityResolver(change, conflict) {
    if (conflict.type !== 'newer-target') {
      return { action: 'proceed' };
    }
    
    // If target is newer, skip the update
    if (conflict.targetModified > conflict.sourceModified) {
      return { action: 'skip', reason: 'Target is newer than source' };
    }
    
    return { action: 'proceed' };
  }
  
  /**
   * Source priority conflict resolver
   */
  async sourcePriorityResolver(change, conflict) {
    // Always favor the source repository
    return { action: 'proceed' };
  }
  
  /**
   * Merge documentation content intelligently
   */
  mergeDocumentationContent(sourceContent, targetContent) {
    // Simple merge strategy - in real implementation, this would be more sophisticated
    const sourceLines = sourceContent.split('\n');
    const targetLines = targetContent.split('\n');
    
    // Preserve target-specific headers and metadata
    const targetSpecificSections = targetLines.filter(line => 
      line.includes('<!-- TARGET-SPECIFIC -->') || 
      line.includes('<!-- LOCAL-ONLY -->')
    );
    
    return sourceContent + '\n\n' + targetSpecificSections.join('\n');
  }
  
  /**
   * Apply a single change
   */
  async applyChange(change) {
    // Mock implementation - in real system, this would write to actual files/repositories
    console.log(`     Writing to ${change.targetRepo}:${change.targetPath}`);
    
    // Simulate file write
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  /**
   * Check if file exists (mock)
   */
  async fileExists(repo, path) {
    // Mock implementation
    return Math.random() > 0.5;
  }
  
  /**
   * Get file last modified time (mock)
   */
  async getFileLastModified(repo, path) {
    // Mock implementation
    return new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
  }
  
  /**
   * Get target file content (mock)
   */
  async getTargetFileContent(repo, path) {
    // Mock implementation
    return `// Existing content in ${repo}:${path}`;
  }
  
  /**
   * Calculate content similarity
   */
  calculateContentSimilarity(content1, content2) {
    // Simple similarity calculation - in real implementation, use proper diff algorithms
    const words1 = content1.split(/\s+/);
    const words2 = content2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    
    return commonWords.length / Math.max(words1.length, words2.length);
  }
  
  /**
   * Perform full synchronization across all repositories
   */
  async performFullSync() {
    console.log('🚀 Starting full synchronization across all repositories...\n');
    
    const allChanges = [];
    
    // Detect changes from each repository
    for (const [repoName, repo] of Object.entries(this.config.repositories)) {
      if (repo.priority !== 'source-of-truth') {
        const changes = await this.detectChanges(repoName);
        allChanges.push(...changes);
      }
    }
    
    // Sort changes by priority and timestamp
    allChanges.sort((a, b) => {
      const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
      const aPriority = priorityOrder[a.metadata.priority] || 0;
      const bPriority = priorityOrder[b.metadata.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      return new Date(a.timestamp) - new Date(b.timestamp); // Older changes first
    });
    
    // Apply changes
    const results = await this.applyChanges(allChanges);
    
    // Update last sync times
    for (const repoName of Object.keys(this.config.repositories)) {
      this.lastSyncTimes.set(repoName, new Date());
    }
    
    console.log('\n📊 Synchronization Summary:');
    console.log(`   ✅ Applied: ${results.applied}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`   ⚠️  Conflicted: ${results.conflicted}`);
    
    if (results.conflicts.length > 0) {
      console.log('\n🔍 Conflicts requiring manual resolution:');
      results.conflicts.forEach((change, index) => {
        console.log(`   ${index + 1}. ${change.toString()}`);
        change.conflicts.forEach(conflict => {
          console.log(`      - ${conflict.message}`);
        });
      });
    }
    
    return results;
  }
}

/**
 * Generate unique change ID
 */
function generateChangeId() {
  return `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Demo function to show sync engine in action
 */
async function demonstrateSync() {
  console.log('🎯 Sync Engine Prototype Demonstration\n');
  
  const engine = new SyncEngine();
  
  // Mock some changes
  const mockChanges = [
    new SyncChange(
      'update',
      'nxCli', 
      'rawDocs',
      'packages/nx/README.md',
      'features/nx-cli/core/readme.md',
      '# Nx Core Package\n\nUpdated documentation for the core Nx package...',
      { priority: 'high', commit: 'abc123', subject: 'feat: add new generator options' }
    ),
    new SyncChange(
      'create',
      'nxCloud',
      'rawDocs', 
      'docs/features/caching.md',
      'features/nx-cloud/caching.md',
      '# Advanced Caching\n\nNew caching strategies...',
      { priority: 'medium', commit: 'def456', subject: 'docs: add caching guide' }
    ),
    new SyncChange(
      'update',
      'rawDocs',
      'nxCli',
      'guides/cross-platform/monorepo-setup.md', 
      'docs/shared/monorepo-setup.md',
      '# Monorepo Setup Guide\n\nCross-platform setup instructions...',
      { priority: 'medium', commit: 'ghi789', subject: 'docs: update setup guide' }
    )
  ];
  
  console.log('📝 Mock changes to process:');
  mockChanges.forEach((change, index) => {
    console.log(`   ${index + 1}. ${change.toString()}`);
  });
  
  // Demonstrate conflict detection and resolution
  console.log('\n🔍 Detecting conflicts...');
  for (const change of mockChanges) {
    const conflicts = await engine.detectConflicts(change);
    if (conflicts.length > 0) {
      console.log(`   ⚠️  Conflicts found for: ${change.toString()}`);
      conflicts.forEach(conflict => {
        console.log(`      - ${conflict.message}`);
      });
    } else {
      console.log(`   ✅ No conflicts for: ${change.toString()}`);
    }
  }
  
  // Apply changes
  const results = await engine.applyChanges(mockChanges);
  
  console.log('\n🎉 Demo complete!');
  return results;
}

/**
 * Save sync configuration to file
 */
function saveSyncConfig() {
  const configFile = 'sync-config.json';
  fs.writeFileSync(configFile, JSON.stringify(SYNC_CONFIG, null, 2));
  console.log(`💾 Sync configuration saved to: ${configFile}`);
}

// Export classes and functions for testing
export {
  SyncEngine,
  SyncChange,
  SYNC_CONFIG,
  demonstrateSync,
  saveSyncConfig
};

// Run demonstration if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateSync().then(() => {
    saveSyncConfig();
  });
}