import React, { useEffect, useState } from 'react';

import './index.css';

interface Props {
    items: string[];
    selected_item :number | null,
    onFinish:Function
}

export default function Wheel({ items, selected_item,onFinish}: Props) {
    const [spinning, setSpinning] = useState<'spinning' | ''>('');
    const [wheelVars, setwheelVars] = useState<any>({});
    
    useEffect(() => {
        setSpinning(selected_item !== null ? 'spinning' : '');
        setwheelVars({
            '--nb-item': items.length,
            '--selected-item': selected_item,
        })
        console.log('selectredd ' ,selected_item);
        setTimeout(()=>{
            console.log("Finished "+selected_item);
            
        },1000 * 10)
    }, [selected_item,items,spinning])

    // const spin_wheel = () => {
    //     if (selectedItem === null) {
    //         setSelectedItem(selected_item)
    //     } else {
    //         setSelectedItem(null)
    //         setTimeout(spin_wheel, 500);
    //     }
    // }

    return (
        <div className="wheel-container">
            <div className={`wheel ${spinning}`} id='spinner' style={wheelVars}>
                {items.map((item, index) => {
                    const item_num: any = {
                        '--item-nb': index,
                    }
                    return (
                        <div className="wheel-item" key={index} style={item_num}>
                            {item}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}