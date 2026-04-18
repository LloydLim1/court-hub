import sys
import re

file_path = "d:/Francis 3rd Year/2nd Semester/index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# The python code looks like:
# '''
# 
# # Save first part
# with open('/mnt/agents/output/sportspot_system_part1.html', 'w', encoding='utf-8') as f:
#     f.write(system_html)
# 
# print("Part 1 saved successfully")
# print(f"Length: {len(system_html)} characters")
# 
# 
# part2 = '''
#
# Let's replace anything matches that pattern.
content = re.sub(r"'''[\s\S]*?part\d+\s*=\s*'''\n?", "", content)

# Check if there is a trailing python block at the end of the file
content = re.sub(r"'''[\s\S]*$", "", content)

# Also there might be a leading part1 = ''' at the very beginning, but looking at line 1 it seems it's just <!DOCTYPE html>. Let's write the cleansed content back.

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Fixed {file_path}. Original size: {len(content)}")
