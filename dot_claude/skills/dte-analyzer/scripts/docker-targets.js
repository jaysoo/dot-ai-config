const days = 7;
const since = new Date(Date.now() - days * 24 * 3600 * 1000);

// Distinct docker-matching target names + counts
print("=== Top docker-matching target names (last " + days + " days) ===");
const targets = db.runs.aggregate([
  { $match: { createdAt: { $gte: since }, "tasks.target": { $regex: /docker/i } } },
  { $project: { tasks: { $filter: { input: "$tasks", as: "t", cond: { $regexMatch: { input: "$$t.target", regex: /docker/i } } } } } },
  { $unwind: "$tasks" },
  { $group: { _id: "$tasks.target", taskCount: { $sum: 1 } } },
  { $sort: { taskCount: -1 } },
  { $limit: 30 }
], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();
print("target                                       tasks");
for (const t of targets) {
  print(String(t._id).padEnd(44) + String(t.taskCount).padStart(8));
}

// Sample params field for a few docker tasks to see what's available
print("");
print("=== Sample params for docker tasks ===");
const samples = db.runs.aggregate([
  { $match: { createdAt: { $gte: since }, "tasks.target": { $regex: /docker/i } } },
  { $project: { tasks: { $filter: { input: "$tasks", as: "t", cond: { $regexMatch: { input: "$$t.target", regex: /docker/i } } } }, command: 1 } },
  { $unwind: "$tasks" },
  { $project: { target: "$tasks.target", projectName: "$tasks.projectName", params: "$tasks.params", runCommand: "$command" } },
  { $limit: 8 }
], { allowDiskUse: true, maxTimeMS: 60000 }).toArray();
for (const s of samples) {
  print("---");
  print("target: " + s.target);
  print("project: " + s.projectName);
  print("run command: " + s.runCommand);
  print("params (first 300 chars): " + String(s.params).substring(0, 300));
}
