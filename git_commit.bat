@echo off
cd /d C:\Users\pbdep\OneDrive\Documenten\PB-leer-project_4

echo === Running git add ===
git add "server/models/Follows.js" "server/routes/profile.js" "client/src/pages/Profile.js" "client/src/pages/Profile.test.js" "server/models/Users.js" "server/index.js" "client/src/App.js" "client/src/pages/Home.js" "client/src/pages/Post.js" "client/src/App.css" ".github/copilot-instructions.md"

if errorlevel 1 (
    echo Error during git add
    exit /b 1
)

echo === Running git commit ===
git commit -m "feat: user profile page with follow/unfollow

- Add Follows join table (followerId, followedId, unique index)
- Add GET /profile/:username returning user, posts, isFollowing, counts
- Add POST/DELETE /profile/:username/follow with JWT enforcement
- Add ensurePostsUserNameIndex() guard for query performance
- Add Profile.js page: cover photo, avatar, stats, post feed, Follow btn
- Add 8 RTL tests for profile page (Profile.test.js)
- Wire /profile/:username route in App.js
- Link post author names to profile pages in Home.js and Post.js
- Add all profile CSS to App.css

Bugs fixed during adversarial review:
- Race condition: replaced useCallback+loadProfile with isMounted useEffect
- isOwnProfile: use case-insensitive toLowerCase() comparison
- Missing index: ensurePostsUserNameIndex added to server/index.js sync chain

Known limitation: posts are not paginated (consistent with rest of app)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo === Done ===
