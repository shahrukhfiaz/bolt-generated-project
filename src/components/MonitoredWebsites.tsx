import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// Define website domains mapping
const websiteDomains: Record<string, string> = {
  // Search & Email
  'Google': 'google.com',
  'Bing': 'bing.com',
  'Yahoo': 'yahoo.com',
  'IQDB': 'iqdb.org',
  'Gmail': 'gmail.com',
  'Outlook': 'outlook.com',
  'Yahoo Mail': 'mail.yahoo.com',
  'Proton Mail': 'proton.me',
  'AOL Mail': 'mail.aol.com',
  'Fastmail': 'fastmail.com',
  'Hotmail': 'hotmail.com',
  'Mailfence': 'mailfence.com',
  'Substack': 'substack.com',
  
  // Social Media
  'Facebook': 'facebook.com',
  'Twitter': 'twitter.com',
  'X': 'x.com',
  'Instagram': 'instagram.com',
  'TikTok': 'tiktok.com',
  'LinkedIn': 'linkedin.com',
  'Pinterest': 'pinterest.com',
  'Snapchat': 'snapchat.com',
  'Reddit': 'reddit.com',
  'Discord': 'discord.com',
  'Twitch': 'twitch.tv',
  'Bluesky': 'bsky.app',
  'Gab': 'gab.com',
  'Kwai': 'kwai.com',
  'Mastodon': 'mastodon.social',
  'Meta Threads': 'threads.net',
  'OnlyFans': 'onlyfans.com',
  'Parler': 'parler.com',
  'Truth Social': 'truthsocial.com',
  'Tumblr': 'tumblr.com',
  'VK': 'vk.com',
  
  // Streaming
  'YouTube': 'youtube.com',
  'Netflix': 'netflix.com',
  'Spotify': 'spotify.com',
  'Disney+': 'disneyplus.com',
  'Hulu': 'hulu.com',
  'HBO Max': 'hbomax.com',
  'Amazon Prime Video': 'primevideo.com',
  'Apple TV+': 'tv.apple.com',
  'Peacock': 'peacocktv.com',
  '9anime': '9anime.to',
  'AnimeSuge': 'animesuge.to',
  'Apple TV': 'tv.apple.com',
  'BBC iPlayer': 'bbc.co.uk/iplayer',
  'CBS All Access': 'cbs.com',
  'CBS Sports': 'cbssports.com',
  'Crunchyroll': 'crunchyroll.com',
  'DirectTV Now': 'directv.com',
  'Discovery Plus': 'discoveryplus.com',
  'Dish Network': 'dish.com',
  'ESPN': 'espn.com',
  'Funimation': 'funimation.com',
  'Gogoanime': 'gogoanime.tv',
  'Hianime': 'hianime.to',
  'Mobdro': 'mobdro.bz',
  'NFL Network': 'nfl.com/network',
  'Paramount Plus': 'paramountplus.com',
  'Plex': 'plex.tv',
  'PlutoTV': 'pluto.tv',
  'Rabb.it': 'rabb.it',
  'Roku': 'roku.com',
  'Rumble': 'rumble.com',
  'Segi TV': 'segi.tv',
  'Showbox': 'showbox.media',
  'Showtime': 'showtime.com',
  'SiriusXM': 'siriusxm.com',
  'Sling': 'sling.com',
  'Soap2day': 'soap2day.to',
  'Tubi TV': 'tubitv.com',
  'Vimeo': 'vimeo.com',
  'VRV': 'vrv.co',
  'Vudu': 'vudu.com',
  'YouTube TV': 'tv.youtube.com',
  
  // Shopping & Ecommerce
  'Amazon': 'amazon.com',
  'Walmart': 'walmart.com',
  'Target': 'target.com',
  'eBay': 'ebay.com',
  'Etsy': 'etsy.com',
  'Best Buy': 'bestbuy.com',
  'Home Depot': 'homedepot.com',
  'Lowe\'s': 'lowes.com',
  'Costco': 'costco.com',
  'Wayfair': 'wayfair.com',
  'Newegg': 'newegg.com',
  'AliExpress': 'aliexpress.com',
  'Amazon UK': 'amazon.co.uk',
  'Apple': 'apple.com',
  'Dell': 'dell.com',
  'Depop': 'depop.com',
  'Gamestop': 'gamestop.com',
  'Kohls': 'kohls.com',
  'Mercari': 'mercari.com',
  'Poshmark': 'poshmark.com',
  'Shopify': 'shopify.com',
  
  // Tech & Dev
  'GitHub': 'github.com',
  'Stack Overflow': 'stackoverflow.com',
  'Microsoft': 'microsoft.com',
  'Cloudflare': 'cloudflare.com',
  'AWS': 'aws.amazon.com',
  'Azure': 'azure.microsoft.com',
  'Google Cloud': 'cloud.google.com',
  'DigitalOcean': 'digitalocean.com',
  'Heroku': 'heroku.com',
  'GitLab': 'gitlab.com',
  'Figma': 'figma.com',
  'CrowdStrike': 'crowdstrike.com',
  'Tailscale': 'tailscale.com',
  
  // Telecom & ISP
  'AT&T': 'att.com',
  'Verizon': 'verizon.com',
  'T-Mobile': 't-mobile.com',
  'Sprint': 'sprint.com',
  'Comcast': 'xfinity.com',
  'Spectrum': 'spectrum.com',
  'Cox': 'cox.com',
  'Comcast Mail': 'mail.comcast.net',
  'Google Fiber': 'fiber.google.com',
  'Mediacom': 'mediacomcable.com',
  'Optimum': 'optimum.net',
  'RCN': 'rcn.com',
  'Sparklight': 'sparklight.com',
  'Starlink': 'starlink.com',
  'Suddenlink': 'suddenlink.com',
  'Windstream': 'windstream.com',
  'Atlantic Broadband': 'atlanticbb.com',
  'CenturyLink': 'centurylink.com',
  'Charter': 'charter.com',
  'Frontier Internet': 'frontier.com',
  'Breezeline': 'breezeline.com',
  'Cricket Wireless': 'cricketwireless.com',
  'Google Fi': 'fi.google.com',
  'Metro PCS': 'metrobyt-mobile.com',
  'Mint Mobile': 'mintmobile.com',
  'Straight Talk': 'straighttalk.com',
  'Tracfone': 'tracfone.com',
  'US Cellular': 'uscellular.com',
  
  // Finance & Banking
  'PayPal': 'paypal.com',
  'Stripe': 'stripe.com',
  'Venmo': 'venmo.com',
  'Cash App': 'cash.app',
  'Robinhood': 'robinhood.com',
  'Coinbase': 'coinbase.com',
  'Binance': 'binance.com',
  'Kraken': 'kraken.com',
  'Chase': 'chase.com',
  'Bank of America': 'bankofamerica.com',
  'Wells Fargo': 'wellsfargo.com',
  'Citibank': 'citi.com',
  'Capital One': 'capitalone.com',
  'American Express': 'americanexpress.com',
  'Discover': 'discover.com',
  'Visa': 'visa.com',
  'Mastercard': 'mastercard.com',
  'Acorns': 'acorns.com',
  'Ally Bank': 'ally.com',
  'Barclays': 'barclays.com',
  'Chime': 'chime.com',
  'Marcus Bank': 'marcus.com',
  'My Loan Care': 'myloancare.com',
  'Nelnet': 'nelnet.com',
  'PNC Online Banking': 'pnc.com',
  'US Bank': 'usbank.com',
  'USAA': 'usaa.com',
  'Apple Pay': 'apple.com/apple-pay',
  'Authorize.net': 'authorize.net',
  'Patreon': 'patreon.com',
  'Square': 'squareup.com',
  'Wise': 'wise.com',
  'Zelle': 'zellepay.com',
  'Netspend': 'netspend.com',
  'Charles Schwab': 'schwab.com',
  'Etrade': 'etrade.com',
  'Fidelity': 'fidelity.com',
  'M1 Finance': 'm1finance.com',
  'StockTwits': 'stocktwits.com',
  'TD Ameritrade': 'tdameritrade.com',
  'TickPick': 'tickpick.com',
  'Vanguard': 'vanguard.com',
  
  // Food & Delivery
  'DoorDash': 'doordash.com',
  'Grubhub': 'grubhub.com',
  'Uber Eats': 'ubereats.com',
  'Instacart': 'instacart.com',
  'Postmates': 'postmates.com',
  'Seamless': 'seamless.com',
  'Caviar': 'trycaviar.com',
  'Deliveroo': 'deliveroo.com',
  'Chipotle': 'chipotle.com',
  'Dominos': 'dominos.com',
  'Little Caesars': 'littlecaesars.com',
  'Qdoba': 'qdoba.com',
  'Wingstop': 'wingstop.com',
  'Kroger': 'kroger.com',
  'Publix': 'publix.com',
  'Safeway': 'safeway.com',
  
  // Travel
  'Uber': 'uber.com',
  'Lyft': 'lyft.com',
  'Airbnb': 'airbnb.com',
  'Booking.com': 'booking.com',
  'Expedia': 'expedia.com',
  'Kayak': 'kayak.com',
  'Southwest Airlines': 'southwest.com',
  'Delta Air Lines': 'delta.com',
  'American Airlines': 'aa.com',
  'United Airlines': 'united.com',
  'Hilton': 'hilton.com',
  'Marriott': 'marriott.com',
  'Hyatt': 'hyatt.com',
  'British Airways': 'britishairways.com',
  'Flightradar24': 'flightradar24.com',
  'Hotels.com': 'hotels.com',
  'Travelocity': 'travelocity.com',
  'TripAdvisor': 'tripadvisor.com',
  'Turo': 'turo.com',
  'VRBO': 'vrbo.com',
  
  // Voice AI
  'Alexa': 'alexa.amazon.com',
  'Siri': 'apple.com/siri',
  
  // AI Tools
  'ChatGPT': 'chat.openai.com',
  'Bard': 'bard.google.com',
  'Bing AI': 'bing.com',
  'Midjourney': 'midjourney.com',
  'DALL-E': 'openai.com/dall-e',
  'Stable Diffusion': 'stability.ai',
  'Anthropic Claude': 'claude.ai',
  'Candy.ai': 'candy.ai',
  'Chai': 'chai.ml',
  'Character AI': 'character.ai',
  'Chub AI': 'chub.ai',
  'CivitAI': 'civitai.com',
  'Copilot': 'copilot.microsoft.com',
  'CrushOn AI': 'crushon.ai',
  'Deepseek': 'deepseek.ai',
  'Flipped Chat': 'flippedchat.io',
  'GirlfriendGPT': 'girlfriendgpt.io',
  'Google Bard (Gemeni)': 'gemini.google.com',
  'GPT Girlfriend': 'gptgirlfriend.io',
  'Huggingface': 'huggingface.co',
  'JanitorAI': 'janitorai.com',
  'Muah AI': 'muah.ai',
  'Perplexity': 'perplexity.ai',
  'PolyBuzz': 'polybuzz.ai',
  'Replika': 'replika.ai',
  'Scale': 'scale.com',
  'Spicychat.ai': 'spicychat.ai',
  'Talkie AI': 'talkie.ai',
  
  // Gaming
  'Steam': 'steampowered.com',
  'Epic Games': 'epicgames.com',
  'PlayStation Network': 'playstation.com',
  'Xbox Live': 'xbox.com',
  'Nintendo': 'nintendo.com',
  'Roblox': 'roblox.com',
  'Minecraft': 'minecraft.net',
  'Fortnite': 'fortnite.com',
  'League of Legends': 'leagueoflegends.com',
  'World of Warcraft': 'worldofwarcraft.com',
  'Among Us': 'innersloth.com/games/among-us',
  'Apex': 'ea.com/games/apex-legends',
  'Battlefield 2042': 'ea.com/games/battlefield/battlefield-2042',
  'Battlenet': 'battle.net',
  'Blizzard': 'blizzard.com',
  'Call of Duty': 'callofduty.com',
  'Chess.com': 'chess.com',
  'Clash Royale': 'clashroyale.com',
  'CSGO': 'counter-strike.net',
  'CurseForge': 'curseforge.com',
  'Dead by Daylight': 'deadbydaylight.com',
  'Destiny 2': 'bungie.net/destiny',
  'Diablo': 'diablo4.blizzard.com',
  'DOTA': 'dota2.com',
  'DOTA 2': 'dota2.com',
  'EA Servers': 'ea.com',
  'Elden Ring': 'eldenring.bandainamcoent.com',
  'Elder Scrolls Online': 'elderscrollsonline.com',
  'FFXIV': 'finalfantasyxiv.com',
  'Fivem': 'fivem.net',
  'Football Fusion': 'roblox.com/games/football-fusion',
  'Genshin Impact': 'genshin.hoyoverse.com',
  'Gravity Tales': 'gravitytales.com',
  'Growtopia': 'growtopiagame.com',
  'GTA Online': 'rockstargames.com/gta-online',
  'GTA V Online': 'rockstargames.com/gta-v',
  'Halo Infinite': 'halowaypoint.com',
  'Hearthstone': 'playhearthstone.com',
  'Helldivers 2': 'helldivers.com',
  'Hypixel': 'hypixel.net',
  'IMVU': 'imvu.com',
  'Itch.io': 'itch.io',
  'Jackbox.TV': 'jackboxgames.com',
  'League': 'leagueoflegends.com',
  'LOL': 'leagueoflegends.com',
  'Minecraft Realms': 'minecraft.net/realms',
  'Mineplex': 'mineplex.com',
  'MLB The Show': 'mlbtheshow.com',
  'Modern Warfare': 'callofduty.com/modernwarfare',
  'MTG Arena': 'magic.wizards.com/mtgarena',
  'New World': 'newworld.com',
  'Nexusmods': 'nexusmods.com',
  'NFL Fantasy': 'fantasy.nfl.com',
  'Oculus': 'oculus.com',
  'Opensea': 'opensea.io',
  'Origin': 'origin.com',
  'OSRS': 'oldschool.runescape.com',
  'Overwatch': 'playoverwatch.com',
  'Paizo': 'paizo.com',
  'Palworld': 'pocketpair.jp/palworld',
  'Pokemon Go': 'pokemongolive.com',
  'Pokemon Showdown': 'pokemonshowdown.com',
  'Pokerogue': 'pokerogue.com',
  'PS4': 'playstation.com',
  'PSN': 'playstation.com',
  'PubG': 'pubg.com',
  'Rainbow Six Siege': 'ubisoft.com/rainbow-six',
  'Rockstar': 'rockstargames.com',
  'Runescape': 'runescape.com',
  'Sea of Thieves': 'seaofthieves.com',
  'Smite': 'smitegame.com',
  'Tarkov': 'escapefromtarkov.com',
  'TF2': 'teamfortress.com',
  'Titanfall 2': 'ea.com/games/titanfall/titanfall-2',
  'Ubisoft': 'ubisoft.com',
  'Uplay': 'ubisoft.com/uplay',
  'Valorant': 'playvalorant.com',
  'Warzone': 'callofduty.com/warzone',
  'WoW': 'worldofwarcraft.com',
  'Nintendo eshop': 'nintendo.com/store',
  'Google Play Store': 'play.google.com',
  
  // News & Sports
  'CNN': 'cnn.com',
  'Fox News': 'foxnews.com',
  'MSNBC': 'msnbc.com',
  'BBC': 'bbc.com',
  'The New York Times': 'nytimes.com',
  'The Washington Post': 'washingtonpost.com',
  'The Wall Street Journal': 'wsj.com',
  'ESPN': 'espn.com',
  'NFL': 'nfl.com',
  'NBA': 'nba.com',
  'MLB': 'mlb.com',
  'NHL': 'nhl.com',
  'FIFA': 'fifa.com',
  'MSN': 'msn.com',
  'Fandango': 'fandango.com',
  'IMDb': 'imdb.com',
  'Kodi': 'kodi.tv',
  'Letterboxd': 'letterboxd.com',
  'Rotten Tomatoes': 'rottentomatoes.com',
  
  // Web Hosting
  'Shopify': 'shopify.com',
  'WordPress': 'wordpress.com',
  'Wix': 'wix.com',
  'Squarespace': 'squarespace.com',
  'GoDaddy': 'godaddy.com',
  'Bluehost': 'bluehost.com',
  'HostGator': 'hostgator.com',
  'Namecheap': 'namecheap.com',
  'IPower Web Hosting': 'ipower.com',
  'Network Solutions': 'networksolutions.com',
  'WordPress.org': 'wordpress.org',
  
  // Messaging
  'WhatsApp': 'whatsapp.com',
  'Telegram': 'telegram.org',
  'Signal': 'signal.org',
  'Slack': 'slack.com',
  'Discord': 'discord.com',
  'Messenger': 'messenger.com',
  'WeChat': 'wechat.com',
  'Line': 'line.me',
  'Viber': 'viber.com',
  'Facebook Messenger': 'messenger.com',
  'iMessage': 'apple.com/imessage',
  'Kik': 'kik.com',
  'Microsoft Teams': 'teams.microsoft.com',
  'Omegle': 'omegle.com',
  'Skype': 'skype.com',
  'VRChat': 'vrchat.com',
  'Webex': 'webex.com',
  'Zoom': 'zoom.us',
  
  // SaaS
  'Adobe': 'adobe.com',
  'Asana': 'asana.com',
  'Bitly': 'bitly.com',
  'Canva': 'canva.com',
  'Constant Contact': 'constantcontact.com',
  'Creative Market': 'creativemarket.com',
  'DocuSign': 'docusign.com',
  'Dropbox': 'dropbox.com',
  'Filelinked': 'filelinked.com',
  'Flickr': 'flickr.com',
  'Garmin Connect': 'connect.garmin.com',
  'Google Docs': 'docs.google.com',
  'Google Drive': 'drive.google.com',
  'Hubspot': 'hubspot.com',
  'iCloud': 'icloud.com',
  'Jira': 'jira.atlassian.com',
  'Kronos': 'kronos.com',
  'Lunch Money': 'lunchmoney.app',
  'Nest': 'nest.com',
  'Notion': 'notion.so',
  'Office 365': 'office.com',
  'Okta': 'okta.com',
  'Onedrive': 'onedrive.live.com',
  'Plausible': 'plausible.io',
  'Real Debrid': 'real-debrid.com',
  'Ring': 'ring.com',
  'Safari': 'apple.com/safari',
  'Shutterstock': 'shutterstock.com',
  'Teamviewer': 'teamviewer.com',
  'Trello': 'trello.com',
  'Westlaw': 'westlaw.com',
  'Workday': 'workday.com',
  'ZenDesk': 'zendesk.com',
  'Blackboard': 'blackboard.com',
  'Cengage': 'cengage.com',
  'Google Classroom': 'classroom.google.com',
  'Kaplan': 'kaplan.com',
  'Pearson': 'pearson.com',
  'Quizlet': 'quizlet.com',
  'Schoology': 'schoology.com',
  'Quickbooks': 'quickbooks.intuit.com',
  'TurboTax': 'turbotax.intuit.com',
  'SalesForce': 'salesforce.com',
  'ADP': 'adp.com',
  'Ahrefs': 'ahrefs.com',
  'Semrush': 'semrush.com',
  
  // Cryptocurrency
  'Bitgit': 'bitgit.io',
  'Bybit': 'bybit.com',
  'CoinStats': 'coinstats.app',
  'Crypto.com': 'crypto.com',
  'Etherscan': 'etherscan.io',
  'Gemini': 'gemini.com',
  'Phemex': 'phemex.com',
  
  // Dating
  'Bumble': 'bumble.com',
  'Doublelist': 'doublelist.com',
  'Grindr': 'grindr.com',
  'Match': 'match.com',
  'OkCupid': 'okcupid.com',
  'POF': 'pof.com',
  'Raya': 'raya.app',
  'Tinder': 'tinder.com',
  
  // Communities
  'Amino': 'aminoapps.com',
  'AOL': 'aol.com',
  'Archive of Our Own': 'archiveofourown.org',
  'BetterHelp': 'betterhelp.com',
  'Credit Karma': 'creditkarma.com',
  'Fanfiction.net': 'fanfiction.net',
  'Fanmio': 'fanmio.com',
  'Hacker News': 'news.ycombinator.com',
  'iFunny': 'ifunny.co',
  'Imgur': 'imgur.com',
  'LiveJournal': 'livejournal.com',
  'MangaDex': 'mangadex.org',
  'manganelo': 'manganelo.com',
  'Medium': 'medium.com',
  'Meetup': 'meetup.com',
  'Newgrounds': 'newgrounds.com',
  'Nextdoor': 'nextdoor.com',
  'Quora': 'quora.com',
  'SpaceBattles': 'spacebattles.com',
  'The Knot': 'theknot.com',
  'Untappd': 'untappd.com',
  'Wattpad': 'wattpad.com',
  'Wikipedia': 'wikipedia.org',
  
  // Gambling
  'Bet365': 'bet365.com',
  'Bovada': 'bovada.lv',
  'DraftKings': 'draftkings.com',
  'FanDuel': 'fanduel.com',
  'Stake': 'stake.com',
  
  // Security
  'Lastpass': 'lastpass.com',
  'Securus': 'securustech.net',
  
  // Tickets
  'Stubhub': 'stubhub.com',
  'Ticketek': 'ticketek.com',
  'Ticketmaster': 'ticketmaster.com',
  
  // Therapy
  'Talkspace': 'talkspace.com',
  
  // Moving Services
  'U Haul': 'uhaul.com',
  
  // Real Estate
  'Zillow': 'zillow.com',
  
  // Internet Infrastructure
  'Amazon Web Services': 'aws.amazon.com',
  'Google Cloud': 'cloud.google.com',
  'Microsoft Azure': 'azure.microsoft.com',
  'Duck DNS': 'duckdns.org',
  'Internet Archive': 'archive.org',
  
  // Books
  'EpubPub': 'epubpub.com',
  'Goodreads': 'goodreads.com',
  'Shepherd': 'shepherd.com',
  
  // Music
  'Amazon Music': 'music.amazon.com',
  'Apple Music': 'music.apple.com',
  'iTunes': 'apple.com/itunes',
  'Pandora': 'pandora.com',
  'SoundCloud': 'soundcloud.com',
  'Soundgasm': 'soundgasm.net',
  
  // Insurance
  'Amica': 'amica.com',
  
  // Shipping
  'FedEx': 'fedex.com',
  'Shipstation': 'shipstation.com',
  'UPS': 'ups.com',
  'USPS': 'usps.com',
  'USPS Tracking': 'tools.usps.com/go/TrackConfirmAction',
  
  // Fitness
  'Fitbit': 'fitbit.com',
  'MyFitnessPal': 'myfitnesspal.com',
  'Peloton': 'onepeloton.com',
  'Strava': 'strava.com',
  'Zwift': 'zwift.com',
  
  // Maps
  'Google Maps': 'maps.google.com',
  'Waze': 'waze.com',
  
  // Job
  'Indeed': 'indeed.com',
  'UWorld': 'uworld.com',
  
  // Healthcare
  'CVS': 'cvs.com',
  'Headspace': 'headspace.com',
  'Walgreens': 'walgreens.com',
  
  // Government
  'EDD': 'edd.ca.gov',
  'FAA': 'faa.gov',
  'FAFSA': 'studentaid.gov',
  'IRS': 'irs.gov',
  'Pay.gov': 'pay.gov',
  'Selective Service System': 'sss.gov',
  'TreasuryDirect': 'treasurydirect.gov',
  
  // VPN
  'ExpressVPN': 'expressvpn.com',
  'NordVPN': 'nordvpn.com',
  'Private Internet Access': 'privateinternetaccess.com'
};

// Define categories and their websites
const categories = {
  'Social Media': [
    'Facebook', 'X', 'Twitter', 'Instagram', 'TikTok', 'LinkedIn', 'Pinterest', 
    'Snapchat', 'Reddit', 'Discord', 'Twitch', 'Bluesky', 'Gab', 'Kwai', 'Mastodon',
    'Meta Threads', 'OnlyFans', 'Parler', 'Truth Social', 'Tumblr', 'VK'
  ],
  'Search & Email': [
    'Google', 'Gmail', 'Outlook', 'Yahoo Mail', 'Proton Mail', 'Bing', 'Yahoo',
    'IQDB', 'AOL Mail', 'Fastmail', 'Hotmail', 'Mailfence', 'Substack'
  ],
  'Streaming': [
    'YouTube', 'Netflix', 'Spotify', 'Twitch', 'Disney+', 'Hulu', 
    'HBO Max', 'Amazon Prime Video', 'Apple TV+', 'Peacock', '9anime',
    'AnimeSuge', 'Apple TV', 'BBC iPlayer', 'CBS All Access', 'CBS Sports',
    'Crunchyroll', 'DirectTV Now', 'Discovery Plus', 'Dish Network', 'ESPN',
    'Funimation', 'Gogoanime', 'Hianime', 'Mobdro', 'NFL Network',
    'Paramount Plus', 'Plex', 'PlutoTV', 'Rabb.it', 'Roku', 'Rumble',
    'Segi TV', 'Showbox', 'Showtime', 'SiriusXM', 'Sling', 'Soap2day',
    'Tubi TV', 'Vimeo', 'VRV', 'Vudu', 'YouTube TV'
  ],
  'Shopping': [
    'Amazon', 'Walmart', 'Target', 'eBay', 'Etsy', 'Best Buy', 
    'Home Depot', 'Lowe\'s', 'Costco', 'Wayfair', 'Newegg'
  ],
  'Ecommerce': [
    'AliExpress', 'Amazon', 'Amazon UK', 'Apple', 'Best Buy', 'Dell',
    'Depop', 'Etsy', 'Gamestop', 'Home Depot', 'Kohls', 'Lowes',
    'Mercari', 'Newegg', 'Poshmark', 'Shopify', 'Target', 'Walmart.com', 'Wayfair'
  ],
  'Tech & Dev': [
    'GitHub', 'Stack Overflow', 'Microsoft', 'Apple', 'Cloudflare', 
    'AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'Heroku', 'GitLab',
    'Figma', 'CrowdStrike', 'Tailscale'
  ],
  'Telecom': [
    'AT&T', 'Verizon', 'T-Mobile', 'Sprint', 'Comcast', 'Spectrum', 'Cox'
  ],
  'ISP': [
    'AT&T', 'Atlantic Broadband', 'CenturyLink', 'Charter', 'Comcast',
    'Comcast Mail', 'Cox', 'Frontier Internet', 'Google Fiber', 'Mediacom',
    'Optimum', 'RCN', 'Sparklight', 'Spectrum', 'Starlink', 'Suddenlink',
    'Verizon', 'Windstream', 'Breezeline'
  ],
  'Cell Phone': [
    'Cricket Wireless', 'Google Fi', 'Metro PCS', 'Mint Mobile', 'Sprint',
    'Straight Talk', 'T-Mobile', 'Tracfone', 'US Cellular'
  ],
  'Finance': [
    'PayPal', 'Stripe', 'Venmo', 'Cash App', 'Robinhood', 'Coinbase', 
    'Binance', 'Kraken', 'Chase', 'Bank of America', 'Wells Fargo', 
    'Citibank', 'Capital One', 'American Express', 'Discover', 'Visa', 'Mastercard'
  ],
  'Bank': [
    'Acorns', 'Ally Bank', 'Bank of America', 'Barclays', 'Chase', 'Chime',
    'Citibank', 'Marcus Bank', 'My Loan Care', 'Nelnet', 'PNC Online Banking',
    'US Bank', 'USAA', 'Wells Fargo'
  ],
  'Payment Services': [
    'Apple Pay', 'Authorize.net', 'Cash App', 'Patreon', 'PayPal', 'Square',
    'Venmo', 'Wise', 'Zelle'
  ],
  'Credit Card': [
    'American Express', 'Capital One', 'Netspend'
  ],
  'Stock Market Trading': [
    'Charles Schwab', 'Etrade', 'Fidelity', 'M1 Finance', 'Robinhood',
    'StockTwits', 'TD Ameritrade', 'TickPick', 'Vanguard'
  ],
  'Cryptocurrency': [
    'Binance', 'Bitgit', 'Bybit', 'Coinbase', 'CoinStats', 'Crypto.com',
    'Etherscan', 'Gemini', 'Kraken', 'Phemex'
  ],
  'Food & Delivery': [
    'DoorDash', 'Grubhub', 'Uber Eats', 'Instacart', 'Postmates', 
    'Seamless', 'Caviar', 'Deliveroo', 'Chipotle', 'Dominos', 'Little Caesars',
    'Qdoba', 'Wingstop'
  ],
  'Grocery': [
    'Costco', 'Instacart', 'Kroger', 'Publix', 'Safeway'
  ],
  'Travel': [
    'Uber', 'Lyft', 'Airbnb', 'Booking.com', 'Expedia', 'Kayak', 
    'Delta Air Lines', 'American Airlines', 'Flightradar24', 'Hilton', 
    'Hotels.com', 'Southwest Airlines', 'Travelocity', 'TripAdvisor', 
    'Turo', 'United Airlines', 'VRBO', 'British Airways'
  ],
  'Taxis': [
    'Lyft', 'Uber'
  ],
  'Voice AI': ['Alexa', 'Siri'],
  'AI Tools': [
    'ChatGPT', 'Bard', 'Bing AI', 'Midjourney', 'DALL-E', 'Stable Diffusion',
    'Anthropic Claude', 'Candy.ai', 'Chai', 'Character AI', 'Chub AI', 'CivitAI',
    'Copilot', 'CrushOn AI', 'Deepseek', 'Flipped Chat', 'GirlfriendGPT',
    'Google Bard (Gemeni)', 'GPT Girlfriend', 'Huggingface', 'JanitorAI',
    'Muah AI', 'Perplexity', 'PolyBuzz', 'Replika', 'Scale', 'Spicychat.ai', 'Talkie AI'
  ],
  'Artificial Intelligence': [
    'Anthropic Claude', 'Candy.ai', 'Chai', 'Character AI', 'ChatGPT', 'Chub AI',
    'CivitAI', 'Copilot', 'CrushOn AI', 'Deepseek', 'Flipped Chat', 'GirlfriendGPT',
    'Google Bard (Gemeni)', 'GPT Girlfriend', 'Huggingface', 'JanitorAI', 'Midjourney',
    'Muah AI', 'Path of Exile', 'Perplexity', 'PolyBuzz', 'Replika', 'Scale',
    'Spicychat.ai', 'Talkie AI'
  ],
  'Gaming': [
    'Steam', 'Epic Games', 'PlayStation Network', 'Xbox Live', 'Nintendo', 
    'Roblox', 'Minecraft', 'Fortnite', 'League of Legends', 'World of Warcraft',
    'Among Us', 'Apex', 'Battlefield 2042', 'Battlenet', 'Blizzard', 'Call of Duty',
    'Chess.com', 'Clash Royale', 'CSGO', 'CurseForge', 'Dead by Daylight', 'Destiny 2',
    'Diablo', 'DOTA', 'DOTA 2', 'EA Servers', 'Elden Ring', 'Elder Scrolls Online',
    'FFXIV', 'Fivem', 'Football Fusion', 'Genshin Impact', 'Gravity Tales', 'Growtopia',
    'GTA Online', 'GTA V Online', 'Halo Infinite', 'Hearthstone', 'Helldivers 2',
    'Hypixel', 'IMVU', 'Itch.io', 'Jackbox.TV', 'League', 'LOL', 'Minecraft Realms',
    'Mineplex', 'MLB The Show', 'Modern Warfare', 'MTG Arena', 'New World', 'Nexusmods',
    'NFL Fantasy', 'Oculus', 'Opensea', 'Origin', 'OSRS', 'Overwatch', 'Paizo',
    'Palworld', 'Pokemon Go', 'Pokemon Showdown', 'Pokerogue', 'PS4', 'PSN', 'PubG',
    'Rainbow Six Siege', 'Rockstar', 'Runescape', 'Sea of Thieves', 'Smite', 'Tarkov',
    'TF2', 'Titanfall 2', 'Ubisoft', 'Uplay', 'Valorant', 'Warzone', 'WoW'
  ],
  'Online Gaming': [
    'Among Us', 'Apex', 'Battlefield 2042', 'Battlenet', 'Blizzard', 'Call of Duty',
    'Chess.com', 'Clash Royale', 'CSGO', 'CurseForge', 'Dead by Daylight', 'Destiny 2',
    'Diablo', 'DOTA', 'DOTA 2', 'EA Servers', 'Elden Ring', 'Elder Scrolls Online',
    'Epic Games', 'FFXIV', 'Fivem', 'Football Fusion', 'Fortnite', 'Genshin Impact',
    'Gravity Tales', 'Growtopia', 'GTA Online', 'GTA V Online', 'Halo Infinite',
    'Hearthstone', 'Helldivers 2', 'Hypixel', 'IMVU', 'Itch.io', 'Jackbox.TV',
    'League', 'LOL', 'Minecraft', 'Minecraft Realms', 'Mineplex', 'MLB The Show',
    'Modern Warfare', 'MTG Arena', 'New World', 'Nexusmods', 'NFL Fantasy', 'Oculus',
    'Opensea', 'Origin', 'OSRS', 'Overwatch', 'Paizo', 'Palworld', 'PlayStation Network',
    'Pokemon Go', 'Pokemon Showdown', 'Pokerogue', 'PS4', 'PSN', 'PubG',
    'Rainbow Six Siege', 'Roblox', 'Rockstar', 'Runescape', 'Sea of Thieves', 'Smite',
    'Steam', 'Tarkov', 'TF2', 'Titanfall 2', 'Ubisoft', 'Uplay', 'Valorant', 'Warzone',
    'WoW', 'Xbox Live'
  ],
  'App Store': [
    'Google Play Store', 'Nintendo eshop'
  ],
  'News & Sports': [
    'CNN', 'Fox News', 'MSNBC', 'BBC', 'The New York Times', 
    'The Washington Post', 'The Wall Street Journal', 'ESPN', 
    'NFL', 'NBA', 'MLB', 'NHL', 'FIFA', 'MSN'
  ],
  'Movies': [
    'Fandango', 'IMDb', 'Kodi', 'Letterboxd', 'Rotten Tomatoes'
  ],
  'Web Hosting': [
    'Shopify', 'WordPress', 'Wix', 'Squarespace', 'GoDaddy', 
    'Bluehost', 'HostGator', 'Namecheap', 'Cloudflare', 'IPower Web Hosting',
    'Network Solutions'
  ],
  'Website Builder': [
    'Squarespace', 'Wix', 'WordPress.com', 'WordPress.org'
  ],
  'Internet Infrastructure and Hosting': [
    'Amazon Web Services', 'Cloudflare', 'Duck DNS', 'Google Cloud',
    'Internet Archive', 'Microsoft Azure'
  ],
  'Messaging': [
    'WhatsApp', 'Telegram', 'Signal', 'Slack', 'Discord', 'Messenger', 
    'WeChat', 'Line', 'Viber', 'Facebook Messenger', 'iMessage', 'Kik',
    'Microsoft Teams', 'Omegle', 'Skype', 'VRChat', 'Webex', 'Zoom'
  ],
  'Message Apps': [
    'Facebook Messenger', 'iMessage', 'Kik', 'Microsoft Teams', 'Omegle',
    'Signal', 'Skype', 'Slack', 'Telegram', 'VRChat', 'Webex', 'WhatsApp', 'Zoom'
  ],
  'SaaS': [
    'Adobe', 'Asana', 'Bitly', 'Canva', 'Constant Contact', 'Creative Market',
    'DocuSign', 'Dropbox', 'Filelinked', 'Flickr', 'Garmin Connect', 'Google Docs',
    'Google Drive', 'Hubspot', 'iCloud', 'Jira', 'Kronos', 'Lunch Money', 'Microsoft',
    'Nest', 'Notion', 'Office 365', 'Okta', 'Onedrive', 'Outlook', 'Plausible',
    'Real Debrid', 'Ring', 'Safari', 'Shutterstock', 'Teamviewer', 'Trello',
    'Westlaw', 'Workday', 'ZenDesk'
  ],
  'Education SaaS': [
    'Blackboard', 'Cengage', 'Google Classroom', 'Kaplan', 'Pearson',
    'Quizlet', 'Schoology'
  ],
  'SMB Saas': [
    'Quickbooks', 'TurboTax'
  ],
  'CRM': [
    'SalesForce'
  ],
  'PEO': [
    'ADP'
  ],
  'SEO Tools': [
    'Ahrefs', 'Semrush'
  ],
  'Music': [
    'Amazon Music', 'Apple Music', 'iTunes', 'Pandora', 'SoundCloud', 'Soundgasm', 'Spotify'
  ],
  'Books': [
    'EpubPub', 'Goodreads', 'Shepherd'
  ],
  'Dating': [
    'Bumble', 'Doublelist', 'Grindr', 'Match', 'OkCupid', 'POF', 'Raya', 'Tinder'
  ],
  'For Developers': [
    'CrowdStrike', 'Figma', 'GitHub', 'GitLab', 'Tailscale'
  ],
  'Communities': [
    'Amino', 'AOL', 'Archive of Our Own', 'BetterHelp', 'Credit Karma', 'Discord',
    'Fanfiction.net', 'Fanmio', 'Hacker News', 'iFunny', 'Imgur', 'LiveJournal',
    'MangaDex', 'manganelo', 'Medium', 'Meetup', 'Newgrounds', 'Nextdoor', 'Quora',
    'Reddit', 'SpaceBattles', 'Stack Overflow', 'The Knot', 'Untappd', 'Wattpad', 'Wikipedia'
  ],
  'Gambling': [
    'Bet365', 'Bovada', 'DraftKings', 'FanDuel', 'Stake'
  ],
  'Security': [
    'Lastpass', 'Securus'
  ],
  'Tickets': [
    'Stubhub', 'Ticketek', 'Ticketmaster'
  ],
  'Online Therapy': [
    'Talkspace'
  ],
  'Moving Services': [
    'U Haul'
  ],
  'Real Estate': [
    'Zillow'
  ],
  'Insurance': [
    'Amica'
  ],
  'Shipping': [
    'FedEx', 'Shipstation', 'UPS', 'USPS', 'USPS Tracking'
  ],
  'Fitness': [
    'Fitbit', 'MyFitnessPal', 'Peloton', 'Strava', 'Zwift'
  ],
  'Maps': [
    'Google Maps', 'Waze'
  ],
  'Job': [
    'Indeed', 'UWorld'
  ],
  'Healthcare': [
    'CVS', 'Headspace', 'Walgreens'
  ],
  'Government': [
    'EDD', 'FAA', 'FAFSA', 'IRS', 'Pay.gov', 'Selective Service System', 'TreasuryDirect'
  ],
  'VPN': [
    'ExpressVPN', 'NordVPN', 'Private Internet Access'
  ],
  'Classifieds and Auctions': [
    'Craigslist', 'eBay', 'Offer Up'
  ],
  'Email Marketing': [
    'Mailchimp'
  ]
};

const MonitoredWebsites: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Get domain for a website
  const getDomain = (website: string): string => {
    return websiteDomains[website] || `${website.toLowerCase().replace(/\s+/g, '')}.com`;
  };

  // Handle website click - navigate and scroll to top
  const handleWebsiteClick = (website: string) => {
    const domain = getDomain(website);
    
    // Navigate to the homepage with the website parameter
    navigate(`/?website=${encodeURIComponent(domain)}`);
    
    // Scroll to the top of the page where the search bar is
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Focus on the website checker section
    const websiteCheckerElement = document.getElementById('website-checker');
    if (websiteCheckerElement) {
      websiteCheckerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter categories and websites based on search term
  const filteredCategories = Object.entries(categories).filter(([category, websites]) => {
    if (!searchTerm) return true;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (category.toLowerCase().includes(lowerSearchTerm)) return true;
    
    return websites.some(website => website.toLowerCase().includes(lowerSearchTerm));
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Websites and Apps We Monitor
      </h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search websites or categories..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map(([category, websites]) => {
          const isExpanded = expandedCategories[category] || false;
          
          // Filter websites based on search term
          const filteredWebsites = searchTerm 
            ? websites.filter(website => website.toLowerCase().includes(searchTerm.toLowerCase()))
            : websites;
          
          return (
            <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {category} <span className="text-sm text-gray-500 dark:text-gray-400">({filteredWebsites.length})</span>
                </h3>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </div>
              
              {isExpanded && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {filteredWebsites.map(website => (
                    <button
                      key={website}
                      onClick={() => handleWebsiteClick(website)}
                      className="text-left text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {website}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonitoredWebsites;
