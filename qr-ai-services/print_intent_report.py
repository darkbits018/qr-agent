# import json
#
# with open("results/intent_report.json", "r") as f:
#     report = json.load(f)
#
# # Pretty print report
# for intent, precision in report["precision"].items():
#     recall = report["recall"][intent]
#     f1 = report["f1_score"][intent]
#     print(f"{intent:15} | P: {precision:.2f}, R: {recall:.2f}, F1: {f1:.2f}")

# import json
#
# with open('results/intent_report.json', 'r') as f:
#     report = json.load(f)
#
# print(report.keys())  # Debug: See available top-level keys

import json

with open('results/intent_report.json', 'r') as f:
    report = json.load(f)

# List of keys to skip (summary metrics)
skip_keys = {'accuracy', 'macro avg', 'weighted avg', 'micro avg'}

for intent, metrics in report.items():
    if intent in skip_keys:
        continue
    precision = metrics.get('precision')
    recall = metrics.get('recall')
    f1 = metrics.get('f1-score')
    print(f"{intent:15} | P: {precision:.2f}, R: {recall:.2f}, F1: {f1:.2f}")
