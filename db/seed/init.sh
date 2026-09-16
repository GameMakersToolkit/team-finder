#!/bin/bash

### PostgreSQL seed script for Team Finder
### This script imports test data from JSON files into PostgreSQL

set -e

echo "Waiting for PostgreSQL to be ready..."
until PGPASSWORD=$PGPASSWORD psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -c "SELECT 1" 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL is up!"

# Import data.json to posts table
echo "Seeding posts from data.json..."
python3 << 'EOF'
import json
import psycopg2
import os
from datetime import datetime

conn = psycopg2.connect(
    host=os.getenv('PGHOST'),
    user=os.getenv('PGUSER'),
    password=os.getenv('PGPASSWORD'),
    database=os.getenv('PGDATABASE')
)
cursor = conn.cursor()

try:
    with open('/data.json', 'r') as f:
        posts = json.load(f)

    for post in posts:
        # Convert lists to JSON strings for storage
        portfolio_links = json.dumps(post.get('portfolioLinks', []))
        skills_possessed = json.dumps([s for s in post.get('skillsPossessed', [])]) if post.get('skillsPossessed') else None
        skills_sought = json.dumps([s for s in post.get('skillsSought', [])]) if post.get('skillsSought') else None
        preferred_tools = json.dumps([t for t in post.get('preferredTools', [])]) if post.get('preferredTools') else None
        timezone_offsets = json.dumps(post.get('timezoneOffsets', []))
        languages = json.dumps(post.get('languages', []))

        cursor.execute('''
            INSERT INTO posts (
                id, jam_id, author, author_id, portfolio_links, description, size,
                skills_possessed, skills_sought, preferred_tools, availability,
                timezone_offsets, languages, query_count, full_page_view_count,
                report_count, unable_to_contact_count, created_at, updated_at, deleted_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        ''', (
            str(post.get('id')),
            post.get('jamId', 'unknown'),
            post.get('author', ''),
            str(post.get('authorId')),
            portfolio_links,
            post.get('description', ''),
            post.get('size', 0),
            skills_possessed,
            skills_sought,
            preferred_tools,
            post.get('availability', 'UNSURE'),
            timezone_offsets,
            languages,
            post.get('queryCount', 0),
            post.get('fullPageViewCount', 0),
            post.get('reportCount', 0),
            post.get('unableToContactCount', 0),
            post.get('createdAt', datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
            post.get('updatedAt', datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
            post.get('deletedAt')
        ))

    conn.commit()
    print(f"Successfully imported {len(posts)} posts from data.json")
except Exception as e:
    print(f"Error importing data.json: {e}")
    conn.rollback()
finally:
    cursor.close()

# Import posts from individual jam JSON files
import glob
for filename in glob.glob('/posts/*.json'):
    print(f"Importing posts from {filename}...")
    try:
        with open(filename, 'r') as f:
            posts = json.load(f)

        for post in posts:
            portfolio_links = json.dumps(post.get('portfolioLinks', []))
            skills_possessed = json.dumps([s for s in post.get('skillsPossessed', [])]) if post.get('skillsPossessed') else None
            skills_sought = json.dumps([s for s in post.get('skillsSought', [])]) if post.get('skillsSought') else None
            preferred_tools = json.dumps([t for t in post.get('preferredTools', [])]) if post.get('preferredTools') else None
            timezone_offsets = json.dumps(post.get('timezoneOffsets', []))
            languages = json.dumps(post.get('languages', []))

            cursor.execute('''
                INSERT INTO posts (
                    id, jam_id, author, author_id, portfolio_links, description, size,
                    skills_possessed, skills_sought, preferred_tools, availability,
                    timezone_offsets, languages, query_count, full_page_view_count,
                    report_count, unable_to_contact_count, created_at, updated_at, deleted_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            ''', (
                str(post.get('id')),
                post.get('jamId', 'unknown'),
                post.get('author', ''),
                str(post.get('authorId')),
                portfolio_links,
                post.get('description', ''),
                post.get('size', 0),
                skills_possessed,
                skills_sought,
                preferred_tools,
                post.get('availability', 'UNSURE'),
                timezone_offsets,
                languages,
                post.get('queryCount', 0),
                post.get('fullPageViewCount', 0),
                post.get('reportCount', 0),
                post.get('unableToContactCount', 0),
                post.get('createdAt', datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
                post.get('updatedAt', datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
                post.get('deletedAt')
            ))

        conn.commit()
        print(f"Successfully imported posts from {filename}")
    except Exception as e:
        print(f"Error importing {filename}: {e}")
        conn.rollback()
        continue

conn.close()
EOF

# Import jams.json to jams table
echo "Seeding jams from jams.json..."
python3 << 'EOF'
import json
import psycopg2
import os

conn = psycopg2.connect(
    host=os.getenv('PGHOST'),
    user=os.getenv('PGUSER'),
    password=os.getenv('PGPASSWORD'),
    database=os.getenv('PGDATABASE')
)
cursor = conn.cursor()

try:
    with open('/jams.json', 'r') as f:
        jams = json.load(f)

    for jam in jams:
        styles = json.dumps(jam.get('styles', {}))
        admin_ids = json.dumps(jam.get('adminIds', []))

        cursor.execute('''
            INSERT INTO jams (
                jam_id, name, status, start, end, styles, admin_ids,
                guild_id, channel_id, guild_invite_link, discord_enabled
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (jam_id) DO NOTHING
        ''', (
            jam.get('jamId'),
            jam.get('name', ''),
            jam.get('status', 'UPCOMING'),
            jam.get('start', 0),
            jam.get('end', 0),
            styles,
            admin_ids,
            jam.get('guildId', ''),
            jam.get('channelId', ''),
            jam.get('guildInviteLink'),
            jam.get('discordEnabled', True)
        ))

    conn.commit()
    print(f"Successfully imported {len(jams)} jams from jams.json")
except Exception as e:
    print(f"Error importing jams.json: {e}")
    conn.rollback()
finally:
    cursor.close()
    conn.close()

echo "Database seeding completed!"
EOF
