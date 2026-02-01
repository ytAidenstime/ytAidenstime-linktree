import * as Icons from "@mui/icons-material";

export default function Announcement({ icon, text, color }) {
    const IconLabel = Icons[icon];

    const colors = {
        green: "#23b10a",
        red: "#cf0505",
        blue: "#0508cf",
        purple: "#ad05cf",
        aqua: "#02cfd6",
        gold: "#d69d02"
    }

    return <div className="announcement-item" style={{ background: colors[color] }}>
        <IconLabel />
        <span>{text}</span>
    </div>
}