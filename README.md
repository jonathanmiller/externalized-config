# Externalized Config

A module for loading externalized configuration files in a Node.js app.

This module will attempt to load a JSON configuration file in the following manner.

1. Look for an environment variable in the format "{{appname}}_CONFIG"
2. Look for the existence of a file at the location "$HOME/.config/{{appname}}.json"
3. Look for a process augment "--config"

This module will provide options to override the pre-defined formats and locations listed above.

