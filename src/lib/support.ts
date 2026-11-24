/**
 * Where a reader's message goes (JCE-054). The production site is a static export with no server of its own, so the
 * report form of the server build (src/app/report) does not exist there; messages go through the operator's form.
 * One constant, so the contact page, the help page and the footers cannot drift apart.
 */
export const CONTACT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfHZH0TYhg8IRYS2edLInWzoCrbm-wyuBLgB3xNhJn6aZyVnQ/viewform";
export const OPERATOR_SITE_URL = "https://yugenq.kigyo-hyakka.com/";
export const DIAGNOSIS_URL = "https://shindan.kigyo-hyakka.com/";
