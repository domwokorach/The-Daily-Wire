#!/bin/bash
# Daily check for whether footballdata.io's current Premier League season
# roster has self-corrected. As of 2026-09-01, /leagues/15/standings for the
# current (2026/27) season incorrectly includes Hull City AFC, Ipswich Town
# FC, and Coventry City FC (not actually in this season's Premier League),
# instead of the real promoted clubs Sunderland AFC, Leeds United FC, and
# Burnley FC. The completed 2025/26 season's data is correct, so this is
# specifically a current-season data-freshness issue on their end.
#
# Run manually: bash scripts/check-footballdata-season.sh
# Scheduled via: ~/Library/LaunchAgents/com.news-storys.footballdata-check.plist

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$PROJECT_DIR/.env"
LOG_FILE="$PROJECT_DIR/scripts/footballdata-check.log"

if [ ! -f "$ENV_FILE" ]; then
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ERROR: .env not found at $ENV_FILE" >> "$LOG_FILE"
  exit 1
fi

API_KEY=$(grep -o 'FOOTBALL_DATA_API_KEY="[^"]*"' "$ENV_FILE" | sed 's/FOOTBALL_DATA_API_KEY="//;s/"$//')

if [ -z "$API_KEY" ]; then
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ERROR: FOOTBALL_DATA_API_KEY not set in .env" >> "$LOG_FILE"
  exit 1
fi

RESPONSE=$(curl -s -m 15 "https://footballdata.io/api/v1/leagues/15/standings" -H "Authorization: Bearer $API_KEY")
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

BAD_TEAMS_PRESENT=0
for team in "Hull City AFC" "Ipswich Town FC" "Coventry City FC"; do
  if echo "$RESPONSE" | grep -qF "\"team_name\":\"$team\""; then
    BAD_TEAMS_PRESENT=1
  fi
done

GOOD_TEAMS_PRESENT=1
for team in "Sunderland AFC" "Leeds United FC" "Burnley FC"; do
  if ! echo "$RESPONSE" | grep -qF "\"team_name\":\"$team\""; then
    GOOD_TEAMS_PRESENT=0
  fi
done

if [ "$BAD_TEAMS_PRESENT" -eq 0 ] && [ "$GOOD_TEAMS_PRESENT" -eq 1 ]; then
  echo "$TIMESTAMP FOOTBALLDATA SELF-CORRECTED: current-season Premier League roster now looks accurate. Migration from API-Football could be reconsidered." >> "$LOG_FILE"
  osascript -e 'display notification "footballdata.io current-season data looks correct now — see scripts/footballdata-check.log" with title "footballdata.io self-corrected"' 2>/dev/null || true
else
  echo "$TIMESTAMP still incorrect (bad teams present: $BAD_TEAMS_PRESENT, good teams present: $GOOD_TEAMS_PRESENT)" >> "$LOG_FILE"
fi
