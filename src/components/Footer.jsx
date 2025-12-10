import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/newlogo14.png";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaGithub, FaYoutube, FaArrowRight, FaStar, FaExternalLinkAlt } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-secondary border-t py-12 mt-12">
    <div className="max-w-7xl mx-auto px-6">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Logo & Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img
              src={logo}
              alt="Conbyt Logo"
              className="h-10 md:h-12 lg:h-14 w-auto"
            />
          </Link>
          <p className="text-text text-sm mb-4 max-w-xs">
            Craft your digital revolution. Powerful AI solutions to simplify complexity and empower your business success.
          </p>
          {/* Call Agent Box */}
          <div className="bg-surface/20 border border-accent/20 rounded-lg p-3 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-accent text-sm" />
                <a href="mailto:muneerhanif7@gmail.com" className="text-accent text-sm hover:text-accent2 transition-colors">
                  info@conbyt.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-accent text-sm" />
                <span className="text-accent text-sm">Islamabad, Pakistan</span>
              </div>
            </div>
          </div>
          {/* Payment Methods */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-4">
            {/* Maestro */}
            <div className="bg-white rounded px-1 py-0.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="25" className="w-8 h-5 sm:w-10 sm:h-6 md:w-12 md:h-7 lg:w-14 lg:h-8" viewBox="0 0 60 40" fill="none">
                <rect x="0.5" y="0.5" width="59" height="39" rx="2.5" fill="white" stroke="#D5DFFF"></rect>
                <g clipPath="url(#clip0_180_768)">
                  <path d="M34.6913 25.0427H26.3088V10.0396H34.6913V25.0427Z" fill="#6C6BBD"></path>
                  <path d="M26.8409 17.5411C26.8409 14.4976 28.2716 11.7866 30.4997 10.0395C28.8704 8.76193 26.8141 7.99939 24.5793 7.99939C19.2887 7.99939 15 12.2713 15 17.5411C15 22.8109 19.2887 27.0828 24.5793 27.0828C26.8141 27.0828 28.8704 26.3202 30.4997 25.0427C28.2716 23.2956 26.8409 20.5845 26.8409 17.5411Z" fill="#D32011"></path>
                  <path d="M46.0001 17.5411C46.0001 22.8109 41.7114 27.0828 36.4208 27.0828C34.186 27.0828 32.1297 26.3202 30.4998 25.0427C32.7284 23.2956 34.1592 20.5845 34.1592 17.5411C34.1592 14.4976 32.7284 11.7866 30.4998 10.0395C32.1297 8.76193 34.186 7.99939 36.4208 7.99939C41.7114 7.99939 46.0001 12.2713 46.0001 17.5411Z" fill="#0099DF"></path>
                  <path d="M37.5273 29.2818C37.6388 29.2818 37.799 29.303 37.9214 29.351L37.7509 29.8702C37.6339 29.8223 37.517 29.8065 37.4049 29.8065C37.0431 29.8065 36.8622 30.0395 36.8622 30.4581V31.8788H36.3085V29.3455H36.8567V29.6531C37.0005 29.4304 37.2082 29.2818 37.5273 29.2818ZM35.482 29.849H34.5775V30.9937C34.5775 31.2479 34.6676 31.4178 34.9447 31.4178C35.0885 31.4178 35.2694 31.3698 35.4339 31.2746L35.5934 31.7459C35.418 31.8679 35.1415 31.9425 34.9021 31.9425C34.2473 31.9425 34.0189 31.5925 34.0189 31.004V29.849H33.5024V29.3455H34.0189V28.5769H34.5775V29.3455H35.482V29.849ZM28.3988 30.3895C28.4579 30.0237 28.6808 29.7744 29.0749 29.7744C29.4312 29.7744 29.6602 29.997 29.7187 30.3895H28.3988ZM30.2937 30.6121C30.2882 29.8223 29.7985 29.2818 29.0852 29.2818C28.3403 29.2818 27.8189 29.8223 27.8189 30.6121C27.8189 31.4171 28.3616 31.9419 29.123 31.9419C29.5061 31.9419 29.8569 31.8466 30.1658 31.587L29.8941 31.1787C29.6815 31.3486 29.4099 31.4438 29.1547 31.4438C28.7983 31.4438 28.4737 31.2794 28.3939 30.8239H30.2827C30.2882 30.7547 30.2937 30.6862 30.2937 30.6121ZM32.7252 29.9922C32.5711 29.8963 32.2574 29.7744 31.9328 29.7744C31.6294 29.7744 31.4485 29.886 31.4485 30.0716C31.4485 30.2409 31.6398 30.2888 31.8792 30.3204L32.1398 30.3574C32.6935 30.4374 33.0285 30.6704 33.0285 31.1156C33.0285 31.5979 32.6028 31.9425 31.8688 31.9425C31.4534 31.9425 31.0703 31.8363 30.7669 31.6137L31.0276 31.1842C31.214 31.3274 31.4912 31.4493 31.8743 31.4493C32.2519 31.4493 32.4541 31.3383 32.4541 31.1417C32.4541 30.9992 32.3104 30.9191 32.0071 30.8772L31.7464 30.8402C31.1769 30.7602 30.8681 30.506 30.8681 30.0929C30.8681 29.5894 31.2835 29.2818 31.9273 29.2818C32.3317 29.2818 32.699 29.3722 32.9646 29.5469L32.7252 29.9922ZM39.5501 29.8053C39.4362 29.8053 39.3309 29.8253 39.2328 29.8648C39.1353 29.9048 39.0507 29.9606 38.9794 30.0322C38.9082 30.1038 38.8521 30.1899 38.8113 30.29C38.7705 30.3901 38.7504 30.5005 38.7504 30.6206C38.7504 30.7414 38.7705 30.8512 38.8113 30.9513C38.8521 31.0513 38.9082 31.1375 38.9794 31.2091C39.0507 31.2807 39.1353 31.3365 39.2328 31.3765C39.3309 31.4165 39.4362 31.436 39.5501 31.436C39.664 31.436 39.77 31.4165 39.8675 31.3765C39.9655 31.3365 40.0508 31.2807 40.1221 31.2091C40.1946 31.1375 40.2506 31.0513 40.292 30.9513C40.3328 30.8512 40.3529 30.7414 40.3529 30.6206C40.3529 30.5005 40.3328 30.3901 40.292 30.29C40.2506 30.1899 40.1946 30.1038 40.1221 30.0322C40.0508 29.9606 39.9655 29.9048 39.8675 29.8648C39.77 29.8253 39.664 29.8053 39.5501 29.8053ZM39.5501 29.2818C39.7475 29.2818 39.9302 29.3158 40.0983 29.3843C40.2664 29.4523 40.412 29.5463 40.5344 29.6658C40.6575 29.7853 40.7531 29.9267 40.8225 30.0892C40.892 30.2524 40.9267 30.4296 40.9267 30.6206C40.9267 30.8117 40.892 30.9889 40.8225 31.152C40.7531 31.3146 40.6575 31.4566 40.5344 31.5761C40.412 31.6956 40.2664 31.789 40.0983 31.8576C39.9302 31.9255 39.7475 31.9595 39.5501 31.9595C39.3528 31.9595 39.1701 31.9255 39.002 31.8576C38.8338 31.789 38.6895 31.6956 38.5677 31.5761C38.4458 31.4566 38.3502 31.3146 38.2808 31.152C38.2113 30.9889 38.1766 30.8117 38.1766 30.6206C38.1766 30.4296 38.2113 30.2524 38.2808 30.0892C38.3502 29.9267 38.4458 29.7853 38.5677 29.6658C38.6895 29.5463 38.8338 29.4523 39.002 29.3843C39.1701 29.3158 39.3528 29.2818 39.5501 29.2818ZM25.1657 30.6121C25.1657 30.1669 25.4586 29.8011 25.9374 29.8011C26.3948 29.8011 26.7036 30.1511 26.7036 30.6121C26.7036 31.0732 26.3948 31.4226 25.9374 31.4226C25.4586 31.4226 25.1657 31.0574 25.1657 30.6121ZM27.225 30.6121V29.3455H26.672V29.6531C26.4959 29.425 26.2304 29.2818 25.8686 29.2818C25.1553 29.2818 24.5968 29.8381 24.5968 30.6121C24.5968 31.3856 25.1553 31.9425 25.8686 31.9425C26.2304 31.9425 26.4959 31.7993 26.672 31.5712V31.8788H27.225V30.6121ZM24.1071 31.8788V30.2888C24.1071 29.6901 23.7239 29.2873 23.1069 29.2818C22.7823 29.2763 22.4467 29.377 22.2128 29.7325C22.0373 29.4517 21.7602 29.2818 21.3716 29.2818C21.1005 29.2818 20.8344 29.3613 20.6267 29.6579V29.3455H20.0736V31.8788H20.6322V30.4744C20.6322 30.0346 20.877 29.8011 21.2547 29.8011C21.6219 29.8011 21.8083 30.0395 21.8083 30.469V31.8788H22.3669V30.4744C22.3669 30.0346 22.6227 29.8011 22.9894 29.8011C23.3676 29.8011 23.5485 30.0395 23.5485 30.469V31.8788H24.1071ZM11.9994 20.8325L13.5077 17.2723L15.0142 20.8325H11.9994Z" fill="#110F0D"></path>
                </g>
                <defs>
                  <clipPath id="clip0_180_768">
                    <rect width="31" height="24" fill="white" transform="translate(15 8)"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            
            {/* JCB */}
            <div className="bg-white rounded px-1 py-0.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="25" className="w-8 h-5 sm:w-10 sm:h-6 md:w-12 md:h-7 lg:w-14 lg:h-8" viewBox="0 0 60 40" fill="none">
                <rect x="0.5" y="0.5" width="59" height="39" rx="2.5" fill="white" stroke="#D5DFFF"></rect>
                <g clipPath="url(#clip0_180_620)">
                  <path d="M49 28.8714C48.9981 30.403 48.3918 31.8713 47.3142 32.954C46.2365 34.0367 44.7756 34.6455 43.252 34.6466H12V11.7752C12.0023 10.2443 12.6083 8.77664 13.6852 7.69407C14.7622 6.61151 16.2221 6.00231 17.7451 6H49V28.8714Z" fill="white"></path>
                  <path d="M38.8236 23.012H41.1983C41.2662 23.012 41.4237 22.9887 41.4873 22.9887C41.7289 22.9369 41.9448 22.8018 42.0976 22.6067C42.2505 22.4117 42.3306 22.169 42.3242 21.9208C42.3235 21.6743 42.2407 21.435 42.089 21.2412C41.9374 21.0474 41.7255 20.9102 41.4873 20.8515C41.3921 20.8329 41.2951 20.8256 41.1983 20.8297H38.8236V23.012Z" fill="url(#paint0_linear_180_620)"></path>
                  <path d="M40.9265 7.93237C39.8349 7.93276 38.7881 8.36883 38.0163 9.14474C37.2444 9.92065 36.8106 10.9729 36.8102 12.0702V16.3678H42.6233C42.759 16.3636 42.8949 16.3709 43.0294 16.3896C44.3418 16.4579 45.3145 17.1408 45.3145 18.322C45.3145 19.2547 44.6583 20.0509 43.4355 20.2107V20.2558C44.7696 20.3473 45.7871 21.097 45.7871 22.2564C45.7871 23.5073 44.6568 24.3253 43.1638 24.3253H36.7871V32.7375H42.8256C43.9173 32.7375 44.9643 32.3016 45.7363 31.5256C46.5082 30.7496 46.9419 29.6971 46.9419 28.5997V7.93237H40.9265Z" fill="url(#paint1_linear_180_620)"></path>
                  <path d="M42.0351 18.595C42.0396 18.3571 41.9568 18.1259 41.8024 17.9455C41.648 17.7652 41.4329 17.6483 41.1983 17.6173C41.152 17.6173 41.0393 17.5955 40.9713 17.5955H38.8236V19.5961H40.9713C41.0478 19.6024 41.1247 19.5946 41.1983 19.5728C41.4329 19.5418 41.648 19.4249 41.8024 19.2446C41.9568 19.0642 42.0396 18.8329 42.0351 18.595Z" fill="url(#paint2_linear_180_620)"></path>
                  <path d="M18.1744 7.93237C17.0826 7.93237 16.0355 8.36827 15.2633 9.14423C14.4911 9.92018 14.0571 10.9726 14.0567 12.0702V22.2855C15.213 22.8535 16.4097 23.2182 17.6079 23.2182C19.0329 23.2182 19.8019 22.3465 19.8019 21.1711V16.3519H23.3313V21.1464C23.3313 23.0105 22.1751 24.5331 18.2655 24.5331C16.8398 24.534 15.4194 24.3584 14.0365 24.01V32.7187H20.075C20.6158 32.7185 21.1513 32.6112 21.6508 32.4029C22.1503 32.1946 22.6041 31.8893 22.9862 31.5047C23.3684 31.12 23.6714 30.6634 23.8779 30.161C24.0844 29.6585 24.1904 29.1201 24.1898 28.5765V7.93237H18.1744Z" fill="url(#paint3_linear_180_620)"></path>
                  <path d="M29.5505 7.93237C28.4589 7.93276 27.4121 8.36883 26.6402 9.14474C25.8684 9.92065 25.4346 10.9729 25.4342 12.0702V17.4808C26.4748 16.5945 28.2844 16.0279 31.201 16.163C32.2918 16.2326 33.3743 16.3998 34.4356 16.6628V18.4063C33.47 17.8874 32.4071 17.5776 31.3152 17.4967C29.0981 17.3384 27.764 18.4295 27.764 20.3386C27.764 22.2709 29.0981 23.3621 31.3152 23.1804C32.4042 23.0937 33.465 22.7895 34.4356 22.2855V24.0289C33.3748 24.2943 32.2921 24.4616 31.201 24.5287C28.2844 24.6653 26.4748 24.0929 25.4342 23.211V32.7593H31.4727C32.0135 32.7595 32.5489 32.6527 33.0486 32.4448C33.5483 32.237 34.0023 31.9322 34.3848 31.548C34.7673 31.1638 35.0708 30.7076 35.2779 30.2054C35.485 29.7033 35.5917 29.1651 35.5919 28.6215V7.93237H29.5505Z" fill="url(#paint4_linear_180_620)"></path>
                </g>
                <defs>
                  <linearGradient id="paint0_linear_180_620" x1="36.9227" y1="22.0485" x2="47.0868" y2="22.0485" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#007940"></stop>
                    <stop offset="0.23" stopColor="#00873F"></stop>
                    <stop offset="0.74" stopColor="#40A737"></stop>
                    <stop offset="1" stopColor="#5CB531"></stop>
                  </linearGradient>
                  <linearGradient id="paint1_linear_180_620" x1="-121039" y1="-2.07901e+06" x2="-120326" y2="-2.07901e+06" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#007940"></stop>
                    <stop offset="0.23" stopColor="#00873F"></stop>
                    <stop offset="0.74" stopColor="#40A737"></stop>
                    <stop offset="1" stopColor="#5CB531"></stop>
                  </linearGradient>
                  <linearGradient id="paint2_linear_180_620" x1="-10962.9" y1="-12232" x2="-10736.7" y2="-12232" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#007940"></stop>
                    <stop offset="0.23" stopColor="#00873F"></stop>
                    <stop offset="0.74" stopColor="#40A737"></stop>
                    <stop offset="1" stopColor="#5CB531"></stop>
                  </linearGradient>
                  <linearGradient id="paint3_linear_180_620" x1="14.0679" y1="20.4357" x2="24.3242" y2="20.4357" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1F286F"></stop>
                    <stop offset="0.48" stopColor="#004E94"></stop>
                    <stop offset="0.83" stopColor="#0066B1"></stop>
                    <stop offset="1" stopColor="#006FBC"></stop>
                  </linearGradient>
                  <linearGradient id="paint4_linear_180_620" x1="25.364" y1="19.9686" x2="35.4172" y2="19.9686" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6C2C2F"></stop>
                    <stop offset="0.17" stopColor="#882730"></stop>
                    <stop offset="0.57" stopColor="#BE1833"></stop>
                    <stop offset="0.86" stopColor="#DC0436"></stop>
                    <stop offset="1" stopColor="#E60039"></stop>
                  </linearGradient>
                  <clipPath id="clip0_180_620">
                    <rect width="37" height="28.6452" fill="white" transform="translate(12 6)"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            
            {/* AMEX */}
            <div className="bg-white rounded px-1 py-0.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="25" className="w-8 h-5 sm:w-10 sm:h-6 md:w-12 md:h-7 lg:w-14 lg:h-8" viewBox="0 0 60 40" fill="none">
                <rect x="0.5" y="0.5" width="59" height="39" rx="2.5" fill="#1F72CD" stroke="#D5DFFF"></rect>
                <path fillRule="evenodd" clipRule="evenodd" d="M10.6137 14L5 26.423H11.7204L12.5536 24.4422H14.4579L15.2911 26.423H22.6883V24.9112L23.3475 26.423H27.1739L27.8331 24.8793V26.423H43.2174L45.0881 24.4937L46.8397 26.423L54.7414 26.439L49.11 20.2462L54.7414 14H46.9623L45.1413 15.8936L43.4448 14H26.7087L25.2715 17.2065L23.8007 14H17.0943V15.4603L16.3483 14H10.6137ZM33.5871 15.7641H42.4215L45.1236 18.6828L47.9127 15.7641H50.6147L46.5093 20.2444L50.6147 24.6731H47.7901L45.0881 21.7205L42.2847 24.6731H33.5871V15.7641ZM35.7687 19.2371V17.6098V17.6082H41.2811L43.6864 20.2107L41.1746 22.8274H35.7687V21.0509H40.5883V19.2371H35.7687ZM11.9141 15.7641H15.1899L18.9135 24.1882V15.7641H22.5021L25.3781 21.8041L28.0287 15.7641H31.5993V24.6784H29.4267L29.409 17.6932L26.2414 24.6784H24.2979L21.1127 17.6932V24.6784H16.643L15.7957 22.6799H11.2177L10.3721 24.6766H7.97735L11.9141 15.7641ZM11.9994 20.8325L13.5077 17.2723L15.0142 20.8325H11.9994Z" fill="white"></path>
              </svg>
            </div>
            
            {/* Mastercard */}
            <div className="bg-white rounded px-1 py-0.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="25" className="w-8 h-5 sm:w-10 sm:h-6 md:w-12 md:h-7 lg:w-14 lg:h-8" viewBox="0 0 60 40" fill="none">
                <rect x="0.5" y="0.5" width="59" height="39" rx="2.5" fill="white" stroke="#D5DFFF"></rect>
                <path d="M34.7353 11.4594H24.6318V29.5399H34.7353V11.4594Z" fill="#FF5F00"></path>
                <path d="M25.2731 20.5C25.2731 16.8264 27.0051 13.568 29.6673 11.4597C27.7108 9.92639 25.241 9 22.5468 9C16.164 9 11 14.143 11 20.5C11 26.8569 16.164 32 22.5468 32C25.241 32 27.7108 31.0736 29.6673 29.5402C27.0051 27.4639 25.2731 24.1736 25.2731 20.5Z" fill="#EB001B"></path>
                <path d="M48.3666 20.5C48.3666 26.8569 43.2027 32 36.8199 32C34.1256 32 31.6559 31.0736 29.6993 29.5402C32.3936 27.4319 34.0935 24.1736 34.0935 20.5C34.0935 16.8264 32.3615 13.568 29.6993 11.4597C31.6559 9.92639 34.1256 9 36.8199 9C43.2027 9 48.3666 14.175 48.3666 20.5Z" fill="#F79E1B"></path>
              </svg>
            </div>
            
            {/* Visa */}
            <div className="bg-white rounded px-1 py-0.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="25" className="w-8 h-5 sm:w-10 sm:h-6 md:w-12 md:h-7 lg:w-14 lg:h-8" viewBox="0 0 60 40" fill="none">
                <rect x="0.5" y="0.5" width="59" height="39" rx="2.5" fill="white" stroke="#D5DFFF"></rect>
                <path fillRule="evenodd" clipRule="evenodd" d="M19.7505 26.6165H16.0291L13.2385 15.9703C13.106 15.4806 12.8248 15.0476 12.4111 14.8436C11.3787 14.3308 10.2411 13.9227 9 13.7168V13.307H14.9949C15.8222 13.307 16.4428 13.9227 16.5462 14.6377L17.9941 22.3172L21.7137 13.307H25.3316L19.7505 26.6165ZM27.4003 26.6165H23.8857L26.7797 13.307H30.2943L27.4003 26.6165ZM34.8411 16.9941C34.9446 16.2773 35.5651 15.8674 36.289 15.8674C37.4267 15.7645 38.6659 15.9703 39.7002 16.4813L40.3207 13.6157C39.2865 13.2058 38.1488 13 37.1164 13C33.7053 13 31.2232 14.8436 31.2232 17.4022C31.2232 19.3487 32.9813 20.3707 34.2224 20.9864C35.5651 21.6004 36.0822 22.0103 35.9788 22.6242C35.9788 23.5451 34.9446 23.955 33.9121 23.955C32.6711 23.955 31.43 23.648 30.2942 23.1352L29.6737 26.0026C30.9147 26.5136 32.2574 26.7194 33.4985 26.7194C37.3233 26.8206 39.7002 24.9788 39.7002 22.2143C39.7002 18.733 34.8411 18.5289 34.8411 16.9941ZM52.0002 26.6165L49.2096 13.307H46.2122C45.5917 13.307 44.9711 13.7168 44.7643 14.3308L39.5968 26.6165H43.2148L43.9369 24.6718H48.3822L48.7959 26.6165H52.0002ZM46.7289 16.8912L47.7613 21.9073H44.8673L46.7289 16.8912Z" fill="#172B85"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-accent">Useful Links</h3>
          <ul className="text-text text-sm space-y-2">
            <li>
              <a href="#aboutus" className="hover:text-accent transition-colors">About</a>
            </li>
            <li>
              <a href="#case-studies" className="hover:text-accent transition-colors">Case Studies</a>
            </li>
            <li>
              <Link to="/" className="text-accent font-medium">Home</Link>
            </li>
            <li>
              <a href="#services" className="hover:text-accent transition-colors">Services</a>
            </li>
            <li>
              <a href="#blogs" className="hover:text-accent transition-colors">Blog</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-accent">Legal Links</h3>
          <ul className="text-text text-sm space-y-2">
            <li>
              <Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-accent">Newsletter</h3>
          <p className="text-text text-sm mb-4">Stay updated with our latest insights and AI innovations.</p>
          
          {/* Newsletter Form */}
          <div className="mb-6">
            <div className="flex mb-2">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-3 py-2 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="bg-accent hover:bg-accent2 transition-colors px-1 py-2 rounded-r-lg text-white text-sm font-medium flex items-center gap-1">
                <span>SUBSCRIBE</span>
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>

          {/* Real Clutch Reviews */}
          <div className="mb-4">
            <a 
              href="https://clutch.co/profile/conbyt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-lg p-3 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-gray-600 text-xs uppercase font-medium mb-1">Reviewed on</span>
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold text-lg">Clutch</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full ml-1"></div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="none" stroke="red" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 text-xs uppercase font-medium">Review us</span>
                </div>
              </div>
            </a>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white text-sm font-medium mb-3">Follow Us</h4>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/profile.php?id=61584143290358" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-surface/20 hover:bg-accent2 transition-colors rounded flex items-center justify-center text-white">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="https://www.linkedin.com/company/conbyt" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-surface/20 hover:bg-accent2 transition-colors rounded flex items-center justify-center text-white">
                <FaLinkedinIn className="text-sm" />
              </a>
              <a href="#" className="w-8 h-8 bg-surface/20 hover:bg-accent transition-colors rounded flex items-center justify-center text-white">
                <FaInstagram className="text-sm" />
              </a>
              <a href="#" className="w-8 h-8 bg-surface/20 hover:bg-accent2 transition-colors rounded flex items-center justify-center text-white">
                <FaTwitter className="text-sm" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <hr className="border-gray-700" />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-text text-sm">
          <div>© {new Date().getFullYear()} Conbyt. All rights reserved.</div>
          <div className="flex gap-4 mt-2 md:mt-0">
  
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;