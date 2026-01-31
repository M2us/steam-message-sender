# Steam Message Sender

DevTools UI script to send multiple Steam profile comments with retries.

## What it does

Paste the script into the Steam profile page console to render a small UI that sends profile comments in bulk, with configurable delays and retry rounds.

## Script

The script lives at `steam-message-sender.js`. Open the file, copy all contents, and paste it into the Console.

## Quick copy

If you're viewing this on GitHub, open `steam-message-sender.js`, click the **Raw** button, copy all text, and paste it into the Console.

## How to use

1. Open the target Steam profile page.
2. Open DevTools and go to the Console tab.
3. Copy the script from `steam-message-sender.js`, paste it, and press Enter.
4. Fill in the fields:
   - Recipient Profile ID: SteamID of the target profile.
   - Your Session ID: `sessionid` value from your cookies.
   - Message: the comment text.
   - Number of Messages: how many comments to send.
   - Delay Between Messages (seconds): pause between sends.
   - Retry Delay (seconds): wait time before retrying failed sends.
   - Increase Delay Between Retries (seconds): added to retry delay after each round.
   - Max Retry Rounds: total retry rounds.
5. Click Start Sending. Use Pause/Stop if needed.

## Notes

- This posts profile comments, not private messages.
- Keep delays reasonable to avoid hitting rate limits.
- Intended for personal or educational use.

## Warning

Excessive or spammy use may trigger Steam rate limits or temporary restrictions. Use responsibly and follow Steam rules.
