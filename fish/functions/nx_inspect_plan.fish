function nx_inspect_plan --description "Inspect Nx hash plan for a project:target"
    if test (count $argv) -ne 1
        echo "Usage: nx_inspect_plan <project:target>"
        echo "Example: nx_inspect_plan myproj:build"
        return 1
    end

    set -l input $argv[1]
    set -l parts (string split ':' $input)

    if test (count $parts) -ne 2
        echo "Error: Invalid format. Expected <project:target>"
        return 1
    end

    set -l project $parts[1]
    set -l target $parts[2]

    set -l temp_script (pwd)/nx_inspect_plan_temp.cjs

    echo "const { createProjectGraphAsync } = require('@nx/devkit');
const { HashPlanInspector } = require('nx/src/hasher/hash-plan-inspector');

async function main() {
  const graph = await createProjectGraphAsync();
  const hashPlanInspector = new HashPlanInspector(graph);
  await hashPlanInspector.init();
  const task = {
    project: '$project',
    target: '$target',
  };
  console.log(
    JSON.stringify(hashPlanInspector.inspectTask(task), null, 2)
  );
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });" > $temp_script

    node $temp_script | tee /tmp/plan.json

    rm -f $temp_script

    echo ""
    echo "Plan written to /tmp/plan.json"
end
