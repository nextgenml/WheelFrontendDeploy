import path from 'path'
import { spin_hours, spin_minute, next_spin_delay } from '../../config.js'
import fs from 'fs'
const __dirname = path.resolve(path.dirname(''));

const winner_data_file_path = path.join(__dirname, 'winners_data.json');
const spinner_data_file_path = path.join(__dirname, 'spinner_data.json');
const initial_spinner_data_file_path = path.join(__dirname, 'items.json')
function randomItemSetter() {
    var no_of_winners_generated = 0
    let time_out = 1000 * 1 // 10 sec
    setInterval(() => {

        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds()
        if (spin_hours.indexOf(hours) >= 0) {
            if (minutes === spin_minute) {
                const spinner_data_file = JSON.parse(fs.readFileSync(spinner_data_file_path));
                //* If no spinner data for today copy from yesterday's data.
                let today_spinner_data;

                const today_date_str = DateToString(new Date())
                
                if (spinner_data_file[today_date_str]) {
                    today_spinner_data = JSON.parse(JSON.stringify(spinner_data_file[today_date_str]))
                }
                else {
                    const initial_items = JSON.parse(JSON.stringify(fs.readFileSync(initial_spinner_data_file_path)));
                    today_spinner_data = initial_items;
                }

                if (today_spinner_data['items'].length < 3) {
                    console.warn("Insufficient spinner items, length < 3");
                    return;
                }

                let update_time = new Date(today_spinner_data['updated_at'])
                let spinner_items = today_spinner_data['items'];
                let new_spinner_data = spinner_data_file;

                if (!isNaN(update_time.getSeconds())) {
                    if (update_time.getHours() === hours && Math.abs(seconds - update_time.getSeconds()) >= next_spin_delay) {
                        today_spinner_data['items'] = spinner_items;
                        today_spinner_data['updated_at'] = new Date().toUTCString();
                        new_spinner_data[today_date_str] = today_spinner_data
                        console.log(JSON.stringify(new_spinner_data).length, ' 49');
                        fs.writeFileSync(spinner_data_file_path, JSON.stringify(new_spinner_data))
                        updateWinners()
                    }
                    else if (update_time.getHours() !== hours) {
                        today_spinner_data['items'] = spinner_items;
                        today_spinner_data['updated_at'] = new Date().toUTCString();
                        new_spinner_data[today_date_str] = today_spinner_data
                        fs.writeFileSync(spinner_data_file_path, JSON.stringify(new_spinner_data))
                        updateWinners()
                    }
                }
                //* if no update_at field in spinner data add it
                else {
                    today_spinner_data['items'] = spinner_items;
                    today_spinner_data['updated_at'] = new Date().toUTCString();
                    new_spinner_data[today_date_str] = today_spinner_data
                    console.log(JSON.stringify(new_spinner_data).length, '65');
                    fs.writeFileSync(spinner_data_file_path, JSON.stringify(new_spinner_data))
                    updateWinners()
                }
            }
        }
    }, time_out)
}


function updateWinners() {
    const winners_data_file = JSON.parse(fs.readFileSync(winner_data_file_path));
    let date = new Date();
    let hours = date.getHours();

    const today_date_str = DateToString(new Date());

    //*selecting by date
    let today_winners_data = winners_data_file[today_date_str];
    //* new day for winners
    if (!today_winners_data) {
        today_winners_data = {}
    }

    //* Check if present hour winner is already generated
    let current_winners_data;
    if (!today_winners_data[hours]) {
        current_winners_data = {};
        current_winners_data['winners'] = [null, null, null];
    } else {
        current_winners_data = JSON.parse(JSON.stringify(today_winners_data[hours]))
    }

    for (let i = 0; i < current_winners_data['winners'].length; i++) {
        const winner = current_winners_data['winners'][i];
        if (winner == null) {
            const spinner_data_file = JSON.parse(fs.readFileSync(spinner_data_file_path));
            let today_spinner_data = JSON.parse(JSON.stringify(spinner_data_file[today_date_str]))

            let spinner_items = today_spinner_data['items'];
            let rand = Math.floor(Math.random() * spinner_items.length)
            current_winners_data['winners'][i] = spinner_items[rand]
            current_winners_data['updated_at'] = new Date().toUTCString();
            spinner_items.splice(rand, 1);

            today_winners_data[hours] = current_winners_data;
            let new_winners_data = winners_data_file;
            new_winners_data[today_date_str] = today_winners_data;

            let new_spinner_data = spinner_data_file;
            today_spinner_data['items'] = spinner_items;
            today_spinner_data['updated_at'] = new Date().toUTCString();
            new_spinner_data[today_date_str] = today_spinner_data
            console.log(JSON.stringify(new_spinner_data).length, 'updateWiiners');
            fs.writeFileSync(spinner_data_file_path, JSON.stringify(new_spinner_data))
            fs.writeFileSync(winner_data_file_path, JSON.stringify(new_winners_data))
            break;
        }
    }
}

export function stringToDate(date_str) {
    let date = new Date();
    let date_str_arr= date_str.split('/');
    date.setDate(parseInt(date_str_arr[0]));
    date.setMonth(parseInt(date_str_arr[1])-1)
    date.setFullYear(parseInt(date_str_arr[2]))

    return date;
}
export function DateToString(date) {
    let d = date.getDate();
    let d_str = d.toString();
    if (d < 9) {
        d_str = '0' + d.toString()
    }
    return `${d_str}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export default {
    randomItemSetter
}