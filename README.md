# discord-gina

Gina is a Discord bot for community management, featuring bug reporting, suggestions, and role synchronization.

## Features

- **Slash Commands**
  - `/say <message>` - Send a plain text message as the bot
  - `/sayrich <title> <message> [color]` - Send a formatted embed message

- **Bug Reporting System** - React to messages in the bugs channel to create private bug report channels with unique IDs

- **Suggestion System** - Automatically adds voting reactions and creates discussion threads for suggestions

- **Role Synchronization** - Sync user roles from an external API with configurable cooldowns

- **REST API** - Health check endpoint and user lookup by Discord tag

## Prerequisites

- Node.js 16.9.0 or higher
- npm
- A Discord bot application

## Discord Bot Setup

### 1. Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** and give it a name
3. Note down the **Application ID** (this is your `clientID`)

### 2. Create a Bot User

1. Navigate to the **Bot** section in the left sidebar
2. Click **Add Bot**
3. Under the **Token** section, click **Reset Token** and copy it (this is your `token`)
4. **Important:** Keep this token secret - never commit it to version control

### 3. Configure Intents

In the **Bot** section, enable the following **Privileged Gateway Intents**:
- Server Members Intent
- Message Content Intent

### 4. Generate Invite Link

1. Go to **OAuth2** > **URL Generator**
2. Select scopes: `bot`, `applications.commands`
3. Select bot permissions:
   - Manage Channels
   - Manage Roles
   - Send Messages
   - Create Public Threads
   - Add Reactions
   - Manage Messages
   - Read Message History
   - View Channels
4. Copy the generated URL and open it to invite the bot to your server

### 5. Get Discord IDs

Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode), then right-click items to copy their IDs:

- **Guild ID**: Right-click your server name > Copy Server ID
- **Channel IDs**: Right-click a channel > Copy Channel ID
- **Role IDs**: Server Settings > Roles > Right-click a role > Copy Role ID
- **Category ID**: Right-click a category > Copy Category ID

## Installation on Ubuntu

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:
```bash
node --version
npm --version
```

### 3. Clone the Repository

```bash
cd /opt
sudo git clone https://github.com/99th-Dutchies/discord-gina.git
sudo chown -R $USER:$USER discord-gina
cd discord-gina
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Configure the Bot

Copy the default config and edit it:

```bash
cp config_default.js config.js
nano config.js
```

Fill in your configuration:

```javascript
export default {
    guildID: 'YOUR_GUILD_ID',
    clientID: 'YOUR_BOT_CLIENT_ID',
    token: 'YOUR_BOT_TOKEN',
    channels: {
        suggestions: 'SUGGESTIONS_CHANNEL_ID',
        bugs: 'BUGS_CHANNEL_ID',
        bugs_category: 'BUGS_CATEGORY_ID',
    },
    roles: {
        bugs: ['ROLE_ID_1', 'ROLE_ID_2'],  // Roles with bug channel access
        ranks: [
            {
                link: 'https://api.example.com/discord/roles/',
                cooldown: 300,  // Seconds between role checks
                divider: 'DIVIDER_ROLE_ID',
                ranks: ['RANK_ROLE_ID'],
            },
        ],
    },
    dateOffset: '2021-01-01 00:00:00',
    express: {
        port: 3000,
    },
};
```

### 6. Test the Bot

```bash
node index.js
```

If everything is configured correctly, you should see the bot come online in your Discord server.

## Running as a Service (Production)

Create a systemd service to run the bot automatically:

### 1. Create Service File

```bash
sudo nano /etc/systemd/system/discord-gina.service
```

Add the following content:

```ini
[Unit]
Description=Discord Gina Bot
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/discord-gina
ExecStart=/usr/bin/node index.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=discord-gina

[Install]
WantedBy=multi-user.target
```

### 2. Set Permissions

```bash
sudo chown -R www-data:www-data /opt/discord-gina
```

### 3. Enable and Start the Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable discord-gina
sudo systemctl start discord-gina
```

### 4. Check Status

```bash
sudo systemctl status discord-gina
```

### 5. View Logs

```bash
sudo journalctl -u discord-gina -f
```

## Configuration Reference

| Key | Description |
|-----|-------------|
| `guildID` | Your Discord server ID |
| `clientID` | Bot application ID from Discord Developer Portal |
| `token` | Bot token from Discord Developer Portal |
| `channels.suggestions` | Channel ID where suggestions are posted |
| `channels.bugs` | Channel ID where users submit bug reports |
| `channels.bugs_category` | Category ID where bug report channels are created |
| `roles.bugs` | Array of role IDs that can access bug channels |
| `roles.ranks` | Array of rank sync configurations |
| `roles.ranks[].link` | External API URL for role data |
| `roles.ranks[].cooldown` | Seconds between role sync checks per user |
| `roles.ranks[].divider` | Divider role ID for the rank group |
| `roles.ranks[].ranks` | Array of role IDs to manage |
| `dateOffset` | Base date for generating bug report channel IDs |
| `express.port` | Port for the Express health check server |

## API Endpoints

The bot runs an Express server with the following endpoints:

- `GET /` - Health check, returns "OK"
- `GET /user/:tag` - Look up a guild member by Discord tag, returns user ID, tag, and nickname

## Firewall Configuration

If you're running the Express server, you may want to configure your firewall:

```bash
# Allow only local access (recommended)
sudo ufw allow from 127.0.0.1 to any port 3000

# Or allow from specific IP
sudo ufw allow from YOUR_IP to any port 3000
```

## Updating

```bash
cd /opt/discord-gina
git pull
npm install
sudo systemctl restart discord-gina
```
