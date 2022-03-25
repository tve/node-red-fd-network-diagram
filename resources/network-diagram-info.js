export default {
  "vue_file": "widgets/network-diagram.vue",
  "base_filename": "network-diagram",
  "module_dir": ".",
  "module_name": "@tve/node-red-fd-network-diagram",
  "resources_dir": "resources",
  "resources_path": "resources/@tve/node-red-fd-network-diagram",
  "name": "NetworkDiagram",
  "name_text": "Network Diagram",
  "name_kebab": "network-diagram",
  "help": "Computer network diagram.\nDisplays a computer network diagram... Send it some JSOn and it does magic...",
  "help_title": "Computer network diagram",
  "help_body": "<p>Displays a computer network diagram... Send it some JSOn and it does magic...</p>",
  "output": true,
  "payload_param": "value",
  "props": {
    "enabled": {
      "name": "enabled",
      "name_text": "Enabled",
      "name_kebab": "enabled",
      "tip": "",
      "default": true,
      "default_html": "true",
      "type": "boolean",
      "input_type": "bool"
    },
    "color": {
      "name": "color",
      "name_text": "Color",
      "name_kebab": "color",
      "tip": "",
      "default": "primary",
      "default_html": "primary",
      "type": "string",
      "input_type": "str"
    },
    "output_value": {
      "name": "output_value",
      "name_text": "Output Value",
      "name_kebab": "output-value",
      "tip": "Value sent on click. ",
      "default": 25,
      "default_html": "25",
      "type": "number",
      "input_type": "num"
    },
    "icon": {
      "name": "icon",
      "name_text": "Icon",
      "name_kebab": "icon",
      "tip": "Material-design-icon name. ",
      "default": null,
      "default_html": null,
      "input_type": "any"
    },
    "title": {
      "name": "title",
      "name_text": "Title",
      "name_kebab": "title",
      "tip": "",
      "default": "Button",
      "default_html": "Button",
      "type": "string",
      "input_type": "str"
    }
  }
}