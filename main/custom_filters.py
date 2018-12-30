from django import template
import json

register = template.Library()


@register.filter
def get_list(dictionary, key):
    json_response = {'parameters': dictionary.getlist(key)}
    return json.dumps(json_response)
