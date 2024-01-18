import {ElixirColorStyle} from "../types"

export function getColorByQuality(quality: number): string {
    switch (true) {
        case quality === 0:
            return "rgb(0, 0, 0)"
        case quality < 10:
            return "rgba(255,86,27,255)"            
        case quality < 30:
            return "rgba(255,241,13,255)"            
        case quality < 70:
            return "rgba(99,177,11,255)"       
        case quality < 90:
            return "rgba(16,205,255,255)"
        case quality < 100:
            return "rgba(181,12,255,255)"
        case quality === 100:
            return "rgba(231,105,41,255)"
    }
    return "rgb(0, 0, 0)" 
}


export function getColorByElixirLevel(elixirLevel: number): ElixirColorStyle {
    switch (true) {
        case elixirLevel === 0:
            return {
                background: 'rgba(247,255,255,255)',
                color: 'rgba(0,0,0,255)'
            }
        case elixirLevel === 1:
            return {
                background: 'rgba(247,255,255,255)',
                color: 'rgba(0,0,0,255)'
            }           
        case elixirLevel === 2:
            return {
                background: 'rgba(0,148,209,255)',
                color: 'rgba(255,255,255,255)'
            }         
        case elixirLevel === 3:
            return {
                background: 'rgba(146,0,185,255)',
                color: 'rgba(255,255,255,255)'
            }          
        case elixirLevel === 4:
            return {
                background: 'rgba(205,112,0,255)',
                color: 'rgba(255,255,255,255)' 
            }       
        case elixirLevel === 5:
            return {
                background: 'rgba(194,56,0,255)',
                color: 'rgba(255,255,255,255)'
            }
    }
    return {
        background: 'rgba(247,255,255,255)',
        color: 'rgba(0,0,0,255)'
    }
}