const SCHOOL_ID = '6724cd433072a8be299591d1';
const SCHOOL_PASSWORD = '$choo!';

export const pamToken = Buffer.from(`${SCHOOL_ID}:${SCHOOL_PASSWORD}`).toString('base64');
