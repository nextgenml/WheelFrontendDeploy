const path = require('path');
const { spin_hours, spin_minute, next_spin_delay } = require('../config.js')
const fs = require('fs');
const fetchAddress = require('../script/tracking')
//import path from 'path'
//import { spin_hours, spin_minute, next_spin_delay } from '../../config.js'
//import fs from 'fs'
//const __dirname = path.resolve(path.dirname(''));

const winner_data_file_path = path.join(__dirname, '../winners_data.json');
const spinner_data_file_path = path.join(__dirname, '../spinner_data.json');

function randomItemSetter() {
    let time_out = 1000 * 1 // 10 sec
    setInterval(async () => {
        try {
            let date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            // date.setSeconds(date.getSeconds() + 3) // Setting 3s offset, to generate the data 3s prior
            let seconds = date.getSeconds()
            if (spin_hours.indexOf(hours) >= 0) {
                if (minutes === spin_minute) {
                    console.log('hit');
                    let spinner_data_file = JSON.parse(fs.readFileSync(spinner_data_file_path));
                    //* If no spinner data for today copy from yesterday's data.
                    let today_spinner_data;

                    const today_date_str = dateToString(new Date())
                    if (!spinner_data_file || Object.keys(spinner_data_file).length == 0) {
                        spinner_data_file = {}
                    }
                    if (spinner_data_file[today_date_str]) {
                        today_spinner_data = JSON.parse(JSON.stringify(spinner_data_file[today_date_str]))
                    }

                    //* Runs for every fresh day
                    else {
                        //? Fetch data here .... for fresh day
                        const new_addresses = await fetchAddress();
                        if (Object.keys(new_addresses).length === 0) {
                            throw ("No transactions for the period!");
                        }
                        console.log(new_addresses, 'fresh day');

                        today_spinner_data = {
                            'items': new_addresses,
                            'created_at': new Date().toUTCString()
                        };
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
                            fs.writeFileSync(spinner_data_file_path, JSON.stringify(new_spinner_data))
                            updateWinners()
                        }

                        else if (update_time.getHours() !== hours) {

                            //? Fetch data here for every 6 hours
                            const new_addresses = await fetchAddress();
                            if (Object.keys(new_addresses).length === 0) {
                                throw ("No transactions for the period!");
                            }
                            console.log(new_addresses, ' For every 6 hours ');
                            today_spinner_data['items'] = new_addresses;
                            today_spinner_data['updated_at'] = new Date().toUTCString();
                            new_spinner_data[today_date_str] = today_spinner_data
                            fs.writeFileSync(spinner_data_file_path, JSON.stringify(new_spinner_data))
                            updateWinners()
                        }
                    }
                    //* if no update_at field in spinner data add it
                    else {
                        console.log('if no update_at field in spinner data add it');
                        today_spinner_data['items'] = spinner_items;
                        today_spinner_data['updated_at'] = new Date().toUTCString();
                        new_spinner_data[today_date_str] = today_spinner_data
                        fs.writeFileSync(spinner_data_file_path, JSON.stringify(new_spinner_data))
                        updateWinners()
                    }
                }
            }
        } catch (err) {
            console.log(err)
        }
    }, time_out)
}


function updateWinners() {
    const winners_data_file = JSON.parse(fs.readFileSync(winner_data_file_path));
    let date = new Date();
    let hours = date.getHours();

    const today_date_str = dateToString(new Date());

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
            fs.writeFileSync(spinner_data_file_path, JSON.stringify(new_spinner_data))
            fs.writeFileSync(winner_data_file_path, JSON.stringify(new_winners_data))
            break;
        }
    }
}

function stringToDate(date_str) {
    let date = new Date();
    let date_str_arr = date_str.split('/');
    date.setDate(parseInt(date_str_arr[0]));
    date.setMonth(parseInt(date_str_arr[1]) - 1)
    date.setFullYear(parseInt(date_str_arr[2]))

    return date;
}
function dateToString(date) {
    let d = date.getDate();
    let d_str = d.toString();
    if (d < 9) {
        d_str = '0' + d.toString()
    }
    return `${d_str}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getFormattedHash(hash) {
    return  hash.splice(0,5) + "..."+hash.substr(hash.length - 5)
}

module.exports = {
    dateToString,
    stringToDate,
    updateWinners,
    getFormattedHash,
    randomItemSetter
}