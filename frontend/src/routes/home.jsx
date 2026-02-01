// components
import Links from "../components/links";
import Info from "../components/info";
import ContactForm from "../components/server_components/contact";
import MailList from "../components/server_components/mailing_list";

// additions
import Countdown from "../components/modules/countdown";
import Announcement from "../components/modules/announcement";

// effects
import Snow from "../components/effects/snow";
import Fire from "../components/effects/fire";

import config from "../configurations/config.json";

export default function Home() {
    const effects = {
        snow: <Snow />,
        fire: <Fire />
    }

    const Announcements = () => {
        return <div className="announcement-wrapper">
            <h1>Announcements</h1>
            {config.announcements.map((announce) => {
                return <Announcement text={announce.info} icon={announce.icon} color={announce.color} />
            })}
        </div>
    }

    return <div className="app">
        {config.announcements.length > 0 ? <Announcements /> : ""}
        {effects[config.customization.effect]}
        {config.settings.countdowns.map((count) => {
            return <Countdown title={count.title} date={count.date} color={count.styles.color} />
        })}
        <Info profile_img={config.settings.profile_image} title={config.settings.title} />
        <Links links={config.settings.links} />
        {config.modules.contact_form.enabled ? <ContactForm /> : <></>}
        {config.modules.mail_list.enabled ? <MailList /> : <></>}
    </div>
}