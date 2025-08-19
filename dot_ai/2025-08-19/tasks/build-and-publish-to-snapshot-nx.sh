#!/bin/bash

# New build and publish script using Nx Release
# Replaces tools/build-and-publish-to-snapshot.sh

set -e

echo "Starting Nx Release Docker build and publish process..."

# Generate CalVer version
CALVER_VERSION=$(node .ai/2025-08-19/tasks/calver-version-generator.mjs)
echo "Generated CalVer version: $CALVER_VERSION"

# Export version for use in commands
export NX_VERSION=$CALVER_VERSION

# Build dependencies first (if needed)
echo "Building application dependencies..."
nx run-many --target=build --projects=tag:docker --parallel=3

# Build all Docker images using Nx
echo "Building Docker images with version $CALVER_VERSION..."
nx run-many --target=docker-build --projects=tag:docker --parallel=3 --args="--version=$CALVER_VERSION"

# Also build workflow executor and log uploader from docker-setup
nx run docker-setup:docker-build-workflow-executor --args="--version=$CALVER_VERSION"
nx run docker-setup:docker-build-workflow-log-uploader --args="--version=$CALVER_VERSION"

# Push to registries
echo "Pushing Docker images to registries..."
nx run-many --target=docker-push --projects=tag:docker --parallel=1 --args="--version=$CALVER_VERSION"

# Push workflow executor and log uploader
nx run docker-setup:docker-push-workflow-executor --args="--version=$CALVER_VERSION"
nx run docker-setup:docker-push-workflow-log-uploader --args="--version=$CALVER_VERSION"

# Tag as latest in both registries
echo "Tagging images as latest..."
REGISTRY="us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud"
QUAY_REGISTRY="quay.io/nxdev"

# List of images to tag as latest
IMAGES=(
  "nx-cloud-nx-api"
  "nx-cloud-file-server"
  "nx-cloud-aggregator"
  "nx-cloud-workflow-controller"
  "nx-cloud-workflow-executor"
  "nx-cloud-workflow-log-uploader"
  "nx-cloud-ai"
  "nx-cloud-background-worker"
  "activemq"
)

for IMAGE in "${IMAGES[@]}"; do
  echo "Tagging $IMAGE:$CALVER_VERSION as latest..."
  docker tag "$IMAGE:$CALVER_VERSION" "$REGISTRY/$IMAGE:latest"
  docker tag "$IMAGE:$CALVER_VERSION" "$QUAY_REGISTRY/$IMAGE:latest"
  docker push "$REGISTRY/$IMAGE:latest"
  docker push "$QUAY_REGISTRY/$IMAGE:latest"
done

# Create and push git tag
echo "Creating git tag $CALVER_VERSION..."
git tag -a "$CALVER_VERSION" -m "Release $CALVER_VERSION"
git push origin "$CALVER_VERSION"

# Publish executor binaries (keeping original logic)
echo "Publishing executor binaries..."
BUCKET_NAME=nxcloud-workflows-executors
gsutil -m cp -r ./dist/apps/nx-cloud-workflow-controller/* "gs://${BUCKET_NAME}/${CALVER_VERSION}/"
gsutil -m cp -r ./dist/apps/nx-cloud-workflow-controller/* "gs://${BUCKET_NAME}/latest/"

echo "✅ Build and publish completed successfully!"
echo "Version: $CALVER_VERSION"
echo "Images pushed to:"
echo "  - GAR: $REGISTRY"
echo "  - Quay: $QUAY_REGISTRY"