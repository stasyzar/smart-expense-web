import type { StatCardProps } from '../types/dashboard';

const StatCard = ({ label, value, change, type = 'default' }: StatCardProps) => {
    const labelClass = type !== 'default' ? `stat-label--${type}` : '';
    const valueClass = type !== 'default' ? `stat-value--${type}` : '';

    return (
        <div className="stat-card">
            <div className={`stat-label ${labelClass}`}>{label}</div>
            <div className={`stat-value ${valueClass}`}>{value}</div>
            {change && (
                <div className={`stat-change ${change.includes('↑') ? 'stat-change--up' : 'stat-change--down'}`}>
                    {change}
                </div>
            )}
        </div>
    );
};

export default StatCard;