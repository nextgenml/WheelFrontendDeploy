import React from 'react'
import { DateToString, getFormattedHash } from '../utils';

interface Props {
    selected_date: Date;
    winners_data: any[];
    no_of_winners_to_display: number
}

export default function WinnersTable(props: Props) {
    return (
        <div className="w-[100%] flex flex-col" >
            <div className="sm:mx-6 lg:mx-8 ">
                <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden ">
                        <table className="min-w-full text-center ">
                            <thead className="border-b bg-gray-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="text-sm font-medium text-white px-6 py-4"
                                    >
                                        {DateToString(props.selected_date).replaceAll("/", '-')}
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-sm font-medium text-white px-6 py-4"
                                    >
                                        First Winner
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-sm font-medium text-white px-6 py-4"
                                    >
                                        Second Winner
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-sm font-medium text-white px-6 py-4"
                                    >
                                        Third Winner
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(props.winners_data[(DateToString(props.selected_date) as any)]) &&
                                    Object.keys((props.winners_data[(DateToString(props.selected_date) as any)]))
                                        .map((hour: any, index) => {
                                            let current_time = hour;
                                            let current_hour_data = props.winners_data[(DateToString(props.selected_date) as any)][hour]
                                            let today_winners = props.winners_data[(DateToString(props.selected_date) as any)];
                                            if (hour > 12) {
                                                current_time = hour + " : " + 15 + "PM"
                                            } else {
                                                current_time = hour + " : " + 15 + "AM"
                                            }
                                            let dates = Object.keys(props.winners_data)
                                            let latest_date = dates[dates.length - 1];

                                            if (latest_date === DateToString(props.selected_date)) {
                                                if (Object.keys(today_winners).length - 1 === index) {
                                                    return (
                                                        <tr key={hour} className="bg-gray-500 border-b border-gray-500">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                                                                {current_time}
                                                            </td>
                                                            {
                                                                (current_hour_data['winners'] as string[]).map((winner_item: any, i) => {
                                                                    if (i < props.no_of_winners_to_display - 1) {
                                                                        return <td key={i} className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                                                                            {getFormattedHash(winner_item)}
                                                                        </td>
                                                                    }
                                                                })
                                                            }
                                                        </tr>)
                                                }
                                            }
                                            return (
                                                <tr key={hour} className="bg-gray-500 border-b border-gray-500">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                                                        {current_time}
                                                    </td>
                                                    {
                                                        (current_hour_data['winners'] as string[]).map((winner_item: any, i) => {
                                                            return <td key={i} className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                                                                {getFormattedHash(winner_item)}
                                                            </td>
                                                        })
                                                    }
                                                </tr>)
                                        })
                                }
                            </tbody>
                        </table>
                        {!(
                            props.winners_data[(DateToString(props.selected_date) as any)]
                        ) &&
                            <>
                                <p style={{ padding: '4rem', fontSize: "1.4rem", margin: "auto", textAlign: 'center' }} className='text-white '>No winner yet today</p>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}   