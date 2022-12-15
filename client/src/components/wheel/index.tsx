import { useEffect, useState } from 'react';
import { getFormattedHash } from '../../utils';

import './index.css';

interface Props {
    items: string[];
    selected_item: number | null,
    onFinish?: Function,
    spinner_wheel_color?: string
}

export default function Wheel({ items, selected_item, onFinish, spinner_wheel_color }: Props) {
    const [spinning, setSpinning] = useState<'spinning' | ''>('');
    const [wheelVars, setwheelVars] = useState<any>({});

    const bg_color :any= {
        '--wheel-color': spinner_wheel_color,
        // '--neutral-color':
    }

    useEffect(() => {
        setSpinning(selected_item !== null ? 'spinning' : '');
        setwheelVars({
            '--nb-item': items.length,
            '--selected-item': selected_item,
        })
        spin_wheel();
        onComplete();
    }, [selected_item, items])


    const onComplete = () => {
        setTimeout(() => {
            if (onFinish) {
                onFinish(selected_item, items)
            }
            console.log("Rotation complete 5 seconds before " + new Date().toTimeString());
        }, 1000 * 3.5)
    }
    const spin_wheel = () => {
        setSpinning('')
        setTimeout(() => {
            setSpinning('spinning');
        }, 500);
    }

    return (
        <div className="wheel-container" style={bg_color}>
            <div className={`wheel ${spinning}`} id='spinner' style={wheelVars}>
                {items.map((item, index) => {
                    const item_num: any = {
                        '--item-nb': index,
                    }
                    return (
                        <div className="wheel-item" key={index} style={item_num}>
                            {getFormattedHash(item)}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}