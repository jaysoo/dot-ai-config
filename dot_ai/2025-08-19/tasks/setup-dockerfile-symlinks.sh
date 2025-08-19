#!/bin/bash

# Script to create Dockerfile symlinks in each project directory
# This allows @nx/docker plugin to infer targets

echo "Creating Dockerfile symlinks for @nx/docker inference..."

# Create symlinks for each project
create_symlink() {
  local project=$1
  local dockerfile=$2
  local project_dir=$3
  
  if [ -f "$dockerfile" ]; then
    if [ ! -e "$project_dir/Dockerfile" ]; then
      ln -s "../../apps/docker-setup/dockerfiles/$(basename $dockerfile)" "$project_dir/Dockerfile"
      echo "  ✅ Created symlink for $project: $project_dir/Dockerfile"
    else
      echo "  ⚠️  Dockerfile already exists for $project"
    fi
  else
    echo "  ❌ Dockerfile not found: $dockerfile"
  fi
}

# nx-api
create_symlink "nx-api" \
  "./apps/docker-setup/dockerfiles/nx-api.dockerfile" \
  "./apps/nx-api"

# file-server
create_symlink "file-server" \
  "./apps/docker-setup/dockerfiles/file-server.dockerfile" \
  "./apps/file-server"

# aggregator
create_symlink "aggregator" \
  "./apps/docker-setup/dockerfiles/aggregator.dockerfile" \
  "./apps/aggregator"

# nx-cloud-workflow-controller
create_symlink "nx-cloud-workflow-controller" \
  "./apps/docker-setup/dockerfiles/nx-cloud-workflow-controller.dockerfile" \
  "./apps/nx-cloud-workflow-controller"

# nx-ai
create_symlink "nx-ai" \
  "./apps/docker-setup/dockerfiles/nx-ai.dockerfile" \
  "./apps/nx-ai"

# nx-background-worker
create_symlink "nx-background-worker" \
  "./apps/docker-setup/dockerfiles/nx-background-worker.dockerfile" \
  "./apps/nx-background-worker"

# activemq (special case - dockerfile is in activemq directory)
if [ -f "./apps/activemq/activemq.dockerfile" ]; then
  if [ ! -e "./apps/activemq/Dockerfile" ]; then
    ln -s "./activemq.dockerfile" "./apps/activemq/Dockerfile"
    echo "  ✅ Created symlink for activemq: ./apps/activemq/Dockerfile"
  else
    echo "  ⚠️  Dockerfile already exists for activemq"
  fi
fi

# docker-setup (special handling for multiple Dockerfiles)
# These need custom handling since one project builds multiple images
echo ""
echo "Note: docker-setup project builds multiple images:"
echo "  - nx-cloud-workflow-executor"
echo "  - nx-cloud-workflow-log-uploader"
echo "  These will need custom targets since @nx/docker expects one Dockerfile per project"

echo ""
echo "✅ Dockerfile symlinks created!"
echo ""
echo "Next steps:"
echo "1. Apply nx.json changes: cp .ai/2025-08-19/tasks/nx.json.preview nx.json"
echo "2. Run: nx show project nx-api --json | jq '.targets | keys' to verify docker:build target"
echo "3. Test: nx release --group=docker-images --dry-run"