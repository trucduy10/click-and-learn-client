import React from "react";
import { Link } from "react-router-dom";
import { BreadcrumbCom } from "../components/breadcrumb";
import FormGroupCom from "../components/common/FormGroupCom";
import GapYCom from "../components/common/GapYCom";
import { HeadingFormH1Com, HeadingH1Com } from "../components/heading";
import { LabelCom } from "../components/label";
import { APP_NAME } from "../constants/config";
import { contact } from "../constants/contact";

const PolicyPage = () => {
  return (
    <form className="theme-form">
      {/* <HeadingFormH1Com className="text-center !text-[#818cf8] font-tw-primary font-light mb-3">
      Sign in your account
    </HeadingFormH1Com> */}
      {/* <HeadingFormH5Com>Login your account</HeadingFormH5Com> */}
      <HeadingFormH1Com>Privacy Policy</HeadingFormH1Com>
      <div className="mt-4 mb-0">
        <h2>Privacy Policy for "{APP_NAME}" Application</h2>
        <p>Effective Date: July 21, 2023</p>
        <br />
        <p>
          We value your privacy and are committed to protecting your personal
          information. When you register an account as a User or an Employee and
          use "{APP_NAME}," we collect necessary data to provide our services.
          Here's how we handle your information:
        </p>
        <br />
        <h3>Information We Collect:</h3>
        <p>
          - Account Registration Details (Name, Email, Password)
          <br />
          - Payment Information (for Course Purchases)
          <br />
          - Course Progress and Exam Data
          <br />
          - Blog Content (for Users who write blogs)
          <br />
          - SEO Content Writing (for Employees working as SEO Content writers)
          <br />
          - Course Management Data (for Employees working in Course Management)
          <br />
        </p>
        <br />
        <h3>How We Use Your Information:</h3>
        <p>
          - Manage Your Account and Course Access
          <br />
          - Provide Customer Support and Notifications
          <br />
          - Deliver Courses and Certificates
          <br />
          - Improve User Experience
          <br />
          - Publish and Display User Blogs (for Users who write blogs)
          <br />
          - Optimize SEO Content (for Employees working as SEO Content writers)
          <br />
          - Administer Course Management (for Employees working in Course
          Management)
          <br />
        </p>
        <br />
        <h3>Data Protection and Security:</h3>
        <p>
          We implement standard security measures to protect your data. Please
          be cautious when accessing our services online.
        </p>
        <br />
        <h3>Data Sharing and Disclosure:</h3>
        <p>
          We do not sell your data. It may be shared with trusted service
          providers only for providing our services effectively.
        </p>
        <br />
        <h3>Legal Compliance:</h3>
        <p>We may disclose data if required by law.</p>
        <br />
        <h3>Your Rights:</h3>
        <p>Access, Correct, and Delete Your Data.</p>
        <br />
        <h3>Changes to Privacy Policy:</h3>
        <p>
          We may update the policy, and the revised version will be posted on
          our website.
        </p>
        <br />
        <h3>Contact Us:</h3>
        <p>For privacy concerns, contact: {contact.email}.</p>
        <br />
        <p>By using "{APP_NAME}," you agree to this Privacy Policy.</p>
        <p>{APP_NAME} Application</p>
      </div>
      <FormGroupCom>
        <div>
          Back to
          <Link
            className="ms-2 text-tw-primary hover:opacity-60 tw-transition-all"
            to="/register"
          >
            Register
          </Link>
        </div>
      </FormGroupCom>
    </form>
  );
};

export default PolicyPage;
