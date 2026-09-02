"""Allow `python -m gh_tool` invocation."""
import sys
from pathlib import Path

# Ensure real-time line buffering when running in background subprocesses
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(line_buffering=True)

# Support running both `python -m gh_tool` and `python .agents/tools/gh_tool`
if __package__ is None or __package__ == "":
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from gh_tool.cli import main
else:
    from .cli import main

if __name__ == "__main__":
    main()
