import * as Icons from "@mui/icons-material";

export default function Links({ links }) {
    const handleClick = (e) => {
        window.open(e.target.getAttribute("data-link"), "_blank");
    }

    return <div className="link-wrapper">
        {links.map((link) => {
            const IconData = Icons[link.icon];

            return <div className="link" data-link={link.link} onClick={handleClick}>
                <IconData className="icons" data-link={link.link} />
                <span data-link={link.link}>{link.name}</span>
                <span data-link={link.link}></span>
            </div>
        })}
    </div>
}