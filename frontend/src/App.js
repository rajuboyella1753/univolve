import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
//! Realted to students for options
import StudentDashboard from './pages/SudentDashboard';
// import CursorGlow from './components/CursorGlow';
import StudentShare from './pages/SudentShare';
import SuperAdminDashboard from "./pages/SuperAdminDashboard"; 
import GirlComplaintForm from './pages/GirlComplaintForm';
import DishaComplaintsDashboard from './pages/DishaComplaintsDashboard';
import PoliceComplaintForm from './pages/PoliceComplaintForm';
import MyComplaints from "./pages/MyComplaints";
import DishaSolvedCases from './pages/DishaSolvedCases';
import PoliceComplaintsDashboard from "./pages/PoliceComplaintsDashboard";
import PoliceSolvedDashboard from "./pages/PoliceSolvedDashboard";
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
// import StudentExplore from './pages/student/ExploreItems';
// import StudentFoodOrders from "./pages/student/StudentFoodOrders";
// //! Dashboards
// import RestaurantDashboard from "./pages/owner/restaraunt/RestaurantDashboard";
// import ShoppingMallDashboard from "./pages/owner/shopping/ShoppingMallDashboard";
// import HostelDashboard from "./pages/owner/hostel/HostelDashboard";
// import HotelDashboard from "./pages/owner/hotel/HotelDashboard";
// import ShoppingExplore from './pages/student/ShoppingExplore';
// //! Adding items by owners
// import AddItemForm from "./pages/owner/shared/AddItemForm";
// import EditItems from "./pages/owner/shared/EditItems";
// //! orders of owners
// import RestaurantOrders from "./pages/owner/restaraunt/OwnerOrders";
// import ShoppingOrders from "./pages/owner/shopping/OwnerOrders";
// import HostelOrders from "./pages/owner/hostel/OwnerOrders";
// import HotelOrders from "./pages/owner/hotel/OwnerOrders";
// ! tails
import ContentNewsUpload from "./pages/admin/ContentNewsUpload";
import ContentUpdateNews from "./pages/admin/ContentUpdateNews";
import ContentDashboard from "./pages/admin/ContentDashboard";
//! students tails 
import NewsFeed from "./pages/student/NewsFeed";
//! golden memory
import GoldenMemory from "./pages/student/GoldenMemories";
//! Carrer guidence
import CarrerGuide from './pages/student-help/AskQuestionForm'
//! Support Admin
import SupportDashboard from "./pages/supportadmin/Dashboard";
import AddLibraryBook from "./pages/supportadmin/AddItem";
import UpdateLibraryBook from "./pages/supportadmin/UpdateItem";
import StudentLibrarySearch from "./pages/student/LibrarySearch";
import PublicChat from './pages/student/PublicChat';
import PlaceExplore from './pages/student/ExploreHappiness'
import StudentMarket from './pages/student/StudentMarket'
import OurRights from './pages/student/OurRights'
import Devotional from './pages/student/DevotionalWisdom'
import ArticleDash from './pages/admin/ArticleDashboard'
import UpdateArticle from './pages/admin/UpdateMonthlyArticle'
import StuArticle from './pages/student/MonthlyArticles'
import Diet from './pages/student/FitnessAndFoodsDashboard'
import AiMentor from './pages/student/AIChatMentor'
// ! suggestion box page
import SuggestionBox from "./pages/student/SuggestionBox";
import Chat from './pages/student/Chat'
import PrivateChatPage from './pages/student/PrivateChatPage';
import InterviewExperiencePage from './pages/student-help/InterviewExperiencePage';
import UnivolveSolvers from './pages/student/UnivolveSolvers'
// import FreelanceUpload from "./pages/student-help/RegisterFreelancer";
import FreelanceList from "./pages/student-help/FreelanceList";
import JobPortal from './pages/student-help/JobPortal'
function App() {
  return (
    <BrowserRouter>
        {/* <CursorGlow/> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/share" element={<StudentShare />} />
        <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
        <Route path="/girl-complaint" element={<GirlComplaintForm />} />
        <Route path="/disha-dashboard" element={<DishaComplaintsDashboard />} />
        <Route path="/police-complaint" element={<PoliceComplaintForm />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/disha-solved" element={<DishaSolvedCases />} />
        <Route path="/police-dashboard" element={<PoliceComplaintsDashboard />} />
        <Route path="/police-solved" element={<PoliceSolvedDashboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        {/* <Route path="/owner/dashboard" element={<RestaurantDashboard />} /> */}
        {/* <Route path="/owner/shoppingmall" element={<ShoppingMallDashboard />} /> */}
        {/* <Route path="/owner/hostel" element={<HostelDashboard />} /> */}
        {/* <Route path="/owner/hotel" element={<HotelDashboard />} /> */}
        
        {/* <Route path="/student/shopping" element={<ShoppingExplore />} /> */}

        {/* <Route path="/explore" element={<StudentExplore />} /> */}
        
        {/* <Route path="/owner/add-items" element={<AddItemForm/>} />

        <Route path="/owner/restaurant/orders" element={<RestaurantOrders />} />
        <Route path="/owner/shopping/orders" element={<ShoppingOrders />} />
        <Route path="/owner/hostel/orders" element={<HostelOrders />} />
        <Route path="/owner/hotel/orders" element={<HotelOrders />} /> */}



        {/* <Route path="/owner/edit-items" element={<EditItems />} />
        <Route path="/student/orders" element={<StudentFoodOrders />} /> */}

        <Route path="/admin/upload-news" element={<ContentNewsUpload />} />
        <Route path="/mbu-tails" element={<NewsFeed />} />
        <Route path="/admin/update-news" element={<ContentUpdateNews />} />
        <Route path="/admin/content-dashboard" element={<ContentDashboard />} />
        <Route path="/golden-page" element={<GoldenMemory/>} />
        <Route path="/student-help" element={<CarrerGuide/>} />

        <Route path="/support/dashboard" element={<SupportDashboard />} />
        <Route path="/support/add-book" element={<AddLibraryBook />} />
        <Route path="/support/update-book" element={<UpdateLibraryBook />} />
        <Route path="/student/library" element={<StudentLibrarySearch />} />
        <Route path="/public-chat" element={<PublicChat />} />
        <Route path="/explore-happiness" element={<PlaceExplore />} />
        <Route path="/student-marketplace" element={<StudentMarket />} />
        <Route path="/student-rights-info" element={<OurRights />} />
        <Route path="/devotional-lessons" element={<Devotional />} />
        <Route path="/admin/upload-article" element={<ArticleDash />} />
        <Route path="/admin/update-article" element={<UpdateArticle />} />

        <Route path="/monthly-article" element={<StuArticle />} />
        <Route path="/fitness-protein" element={<Diet />} />
        <Route path="/ai-chat" element={<AiMentor />} />
        <Route path="/suggestion-box" element={<SuggestionBox />} />
        <Route path="/student/private-chat" element={<PrivateChatPage />} />
        <Route path="/student/chat" element={<Chat />} />
        <Route path="/interview-experience" element={<InterviewExperiencePage />} />
        <Route path="/univolve-solvers" element={<UnivolveSolvers />} />
        {/* <Route path="/freelance/upload" element={<FreelanceUpload />} /> */}
        <Route path="/freelance" element={<FreelanceList />} />
        <Route path="/job-portal" element={<JobPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;