export default function Info({ profile_img, title }) {
    return <div className="profile_data">
        <img src={profile_img} alt="profile image" />
        <p>{title}</p>
    </div>
}