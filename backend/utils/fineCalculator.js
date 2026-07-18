/**
 * Calculate fine for overdue books
 * Default loan period: 14 days
 * Default fine per day: 2.00 INR
 */
const calculateFine = (issuedDate, dueDate, returnDate = new Date()) => {
  const issue = new Date(issuedDate);
  const due = new Date(dueDate);
  const ret = new Date(returnDate);

  // Strip hours
  issue.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  ret.setHours(0, 0, 0, 0);

  if (ret <= due) {
    return {
      daysOverdue: 0,
      fineAmount: 0
    };
  }

  const timeDiff = ret.getTime() - due.getTime();
  const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const fineRate = 2.00; // Rs. 2 per day

  return {
    daysOverdue,
    fineAmount: daysOverdue * fineRate
  };
};

module.exports = {
  calculateFine
};
