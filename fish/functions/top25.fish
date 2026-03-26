function top25
  git log --since '2 month ago' --format='%an'  | sort | uniq -c | sort -nr | head -n 25
end
