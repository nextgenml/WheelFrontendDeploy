#mysql.server start
node dbconnect.js wallets create_spins create_participants scheduled_spins
node dbconnect.js repopulate_spins &
PID=$!
sleep 2
kill $PID


