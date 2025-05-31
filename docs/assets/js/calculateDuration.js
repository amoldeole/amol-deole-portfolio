window.onload = function() {
    const s = new Date(2016, 8, 1);
    const e = new Date();
    console.log(calExactTimeDiff(s, e));
    let duration = calExactTimeDiff(s, e);
    document.getElementById('duration').innerHTML = duration.yrs + '+ Years ';
    showHidePreview();
};

function showHidePreview() {
    const preview = document.getElementById('preview-pdf');
    const previewBtn = document.getElementById('previewBtn');
    const resumeHtml = document.getElementById('resume-html');
    if (preview.style.display === 'none') {
        preview.style.display = 'block';
        previewBtn.innerHTML = 'Hide Preview';
        resumeHtml.style.display = 'none';
    } else {
        preview.style.display = 'none';
        previewBtn.innerHTML = 'Show Preview';
        resumeHtml.style.display = 'flex';
    }
}
// time difference in Days
function getDaysDiff(startDate = new Date(), endDate = new Date()) {
    if (startDate > endDate) [startDate, endDate] = [endDate, startDate];

    let timeDiff = endDate - startDate;
    let timeDiffInDays = Math.floor(timeDiff / (1000 * 3600 * 24));

    return timeDiffInDays;
}

// time difference in Months
function getMonthsDiff(startDate = new Date(), endDate = new Date()) {
    let monthsOfFullYears = getYearsDiff(startDate, endDate) * 12;
    let months = monthsOfFullYears;
    // the variable below is not necessary, but I kept it for understanding of code
    // we can use "startDate" instead of it
    let yearsAfterStart = new Date(
        startDate.getFullYear() + getYearsDiff(startDate, endDate),
        startDate.getMonth(),
        startDate.getDate()
    );
    let isDayAhead = endDate.getDate() >= yearsAfterStart.getDate();
    
    if (startDate.getMonth() == endDate.getMonth() && !isDayAhead) {
        months = 11;
        return months;
    }

    if (endDate.getMonth() >= yearsAfterStart.getMonth()) {
        let diff = endDate.getMonth() - yearsAfterStart.getMonth();
        months += (isDayAhead) ? diff : diff - 1;
    }
    else {
        months += isDayAhead 
        ? 12 - (startDate.getMonth() - endDate.getMonth())
        : 12 - (startDate.getMonth() - endDate.getMonth()) - 1;
    }

    return months;
}

// time difference in Years
function getYearsDiff(startDate = new Date(), endDate = new Date()) {
    if (startDate > endDate) [startDate, endDate] = [endDate, startDate];

    let yearB4End = new Date(
        endDate.getFullYear() - 1,
        endDate.getMonth(),
        endDate.getDate()
    );
    let year = 0;
    year = yearB4End > startDate
        ? yearB4End.getFullYear() - startDate.getFullYear()
        : 0;
    let yearsAfterStart = new Date(
        startDate.getFullYear() + year + 1,
        startDate.getMonth(),
        startDate.getDate()
    );
    
    if (endDate >= yearsAfterStart) year++;
    
    return year;
}

// time difference in format: X years, Y months, Z days
function calExactTimeDiff(firstDate, secondDate) {
    if (firstDate > secondDate)
        [firstDate, secondDate] = [secondDate, firstDate];

    let monthDiff = 0;
    let isDayAhead = secondDate.getDate() >= firstDate.getDate();
    
    if (secondDate.getMonth() >= firstDate.getMonth()) {
        let diff = secondDate.getMonth() - firstDate.getMonth();
        monthDiff += (isDayAhead) ? diff : diff - 1;
    }
    else {
        monthDiff += isDayAhead 
        ? 12 - (firstDate.getMonth() - secondDate.getMonth())
        : 12 - (firstDate.getMonth() - secondDate.getMonth()) - 1;
    }

    let dayDiff = 0;

    if (isDayAhead) {
        dayDiff = secondDate.getDate() - firstDate.getDate();
    }
    else {
        let b4EndDate = new Date(
            secondDate.getFullYear(),
            secondDate.getMonth() - 1,
            firstDate.getDate()
        )
        dayDiff = getDaysDiff(b4EndDate, secondDate);
    }
    
        if (firstDate.getMonth() == secondDate.getMonth() && !isDayAhead)
            monthDiff = 11;

    let exactTimeDiffUnits = {
        yrs: getYearsDiff(firstDate, secondDate),
        mths: monthDiff,
        dys: dayDiff,
    };
    
    return exactTimeDiffUnits;
}