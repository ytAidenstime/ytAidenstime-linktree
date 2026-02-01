import { useState } from "react";

export default function Countdown({ title, date, color }) {
    const [ count, setCount ] = useState({
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
        years: 0
    })

    const colors = {
        grey: "#222222",
        red: "#de0000",
        orange: "#f06e1a",
        aqua: "#0b8b78",
        blue: "#0613bc",
        purple: "#8806bc",
        pink: "#f355a2",
        green: "#07af16",
        yellow: "#ecf310"
    }

    const borderColors = {
        grey: "#2e2e2e",
        red: "#860101",
        orange: "#d84501",
        aqua: "#03a38b",
        blue: "#0613bc",
        purple: "#8806bc",
        pink: "#f355a2",
        green: "#07af16",
        yellow: "#ecf310"
    }

    const formattedDate = new Date(`${date.month} ${date.day} ${date.year} ${date.time}`)

    const startCount = () => {
        const now = new Date().getTime();
        const distance = formattedDate.getTime() - now;

        const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
        const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCount({
            seconds: seconds,
            minutes: minutes,
            hours: hours,
            days: days,
            years: years
        })
    }
    setInterval(startCount, 1000)

    return <div className="countdown-wrapper" style={{ background: colors[color], border: `1px solid ${borderColors[color]}` }}>
        <span>{title}</span>
        <span>{count.years ? `${count.years}Y` : "" } {count.days ? `${count.days}D` : "" } {count.hours ? `${count.hours}H` : "" } {count.minutes ? `${count.minutes}M` : "" } {count.seconds ? `${count.seconds}S` : "" }</span>
    </div>
}