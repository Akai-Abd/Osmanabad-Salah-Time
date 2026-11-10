import { formatTime } from "../utils/formatTime";

function PrayerCard({ name, time, Icon, isCurrent, isNext, isPast, t }) {
    let status = "";
    if (isCurrent) status = "current";
    else if (isNext) status = "next";
    else if (isPast) status = "past";

    return (
        <div className={`prayer-card ${status}`.trim()}>
            <div className="prayer-left">
                {Icon && (
                    <div className="prayer-icon-box">
                        <Icon size={20} strokeWidth={2} />
                    </div>
                )}
                <div className="prayer-name-box">
                    <span className="prayer-name">{name}</span>
                    {isCurrent && <span className="prayer-tag current">{t ? t("current") : "Active"}</span>}
                    {isNext && <span className="prayer-tag next">{t ? t("upcoming") : "Next"}</span>}
                </div>
            </div>
            <div className="prayer-right">
                <span className="prayer-time ltr">{formatTime(time)}</span>
            </div>
        </div>
    );
}

export default PrayerCard;