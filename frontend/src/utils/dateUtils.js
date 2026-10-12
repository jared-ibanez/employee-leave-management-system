export const formatDate = (
    date,
    options = {}
) => {
    if (!date) {
        return "—";
    }

    const defaultOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    return new Intl.DateTimeFormat(
        "en-US",
        {
            ...defaultOptions,
            ...options,
        }
    ).format(new Date(`${date}T00:00:00`));
};


export const formatDateTime = (date) => {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    ).format(new Date(date));
};


/*
|--------------------------------------------------------------------------
| Frontend estimate only.
|--------------------------------------------------------------------------
|
| Laravel remains authoritative when calculating total leave days.
|
*/

export const calculateWeekdays = (
    startDate,
    endDate
) => {
    if (!startDate || !endDate) {
        return 0;
    }

    const start = new Date(
        `${startDate}T00:00:00`
    );

    const end = new Date(
        `${endDate}T00:00:00`
    );

    if (end < start) {
        return 0;
    }

    let total = 0;

    const current = new Date(start);

    while (current <= end) {
        const day = current.getDay();

        if (day !== 0 && day !== 6) {
            total++;
        }

        current.setDate(
            current.getDate() + 1
        );
    }

    return total;
};