with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Identify the block to move
block_start_marker = "            {/* RIGHT COLUMN: Insights, Advanced & Recs */}"
block_end_marker = """                  </div>
                </div>
              </div>

            </div>"""

start_pos = content.find(block_start_marker)
end_pos = content.find(block_end_marker, start_pos) + len(block_end_marker)

block_to_move = content[start_pos:end_pos]

# 2. Remove it from its original location
new_content = content[:start_pos] + content[end_pos:]

# 3. Find where to insert it (under Glow Score)
insert_marker = """                    </div>
                  </div>
                </div>"""

# There are multiple occurrences of this pattern, but the one for glow score is followed by:
glow_score_end = """                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Top Bar + Content Grids */}"""

insert_pos = new_content.find(glow_score_end) + len("""                    </div>
                  </div>
                </div>""")

# 4. Insert the block
final_content = new_content[:insert_pos] + "\n\n" + block_to_move + new_content[insert_pos:]

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Dashboard.jsx rearranged successfully!")
