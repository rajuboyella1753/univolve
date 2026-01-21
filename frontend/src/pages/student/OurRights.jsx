import { useState, useEffect } from "react";
import StuNav from "../StudentNavbar";
import api from "../../api/api-base"; // ready for dynamic data in future

const tabs = ["Overview", "Constitution of India", "Indian Penal Code", "Criminal Procedure Code"];

export default function PowerOfPeople() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) setNavHeight(nav.offsetHeight);
  }, []);

  const constitutionArticles = [
    {
      title: "Article 14 – Equality before Law",
      content: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India."
    },
    {
      title: "Article 21 – Protection of Life and Personal Liberty",
      content: "No person shall be deprived of his life or personal liberty except according to procedure established by law."
    }
  ];

  const ipcSections = [
    {
      title: "Section 354 – Assault or criminal force to woman with intent to outrage her modesty",
      content: "Whoever assaults or uses criminal force on any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty."
    },
    {
      title: "Section 375 – Rape Definition",
      content: "A man is said to commit rape if he has sexual intercourse with a woman under conditions falling within certain circumstances without her consent."
    },
    {
      title: "Section 376 – Punishment for rape",
      content: "Whoever commits rape shall be punished with rigorous imprisonment of not less than ten years."
    }
  ];

  const crpcSections = [
    {
      title: "Form 32 – Warrant for execution of a sentence of death",
      content: "This is issued by the court for execution of capital punishment."
    },
    {
      title: "Form 34 – Warrant of imprisonment",
      content: "Issued when the accused is sentenced to prison by the court."
    }
  ];

  const getFilteredResults = () => {
    const query = search.toLowerCase();
    const inConstitution = constitutionArticles.filter(
      (item) => item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
    );
    const inIPC = ipcSections.filter(
      (item) => item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
    );
    const inCrPC = crpcSections.filter(
      (item) => item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
    );

    return [...inConstitution, ...inIPC, ...inCrPC];
  };

  const renderList = (data) => (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <div key={idx} className="p-4 bg-white rounded shadow">
          <h3 className="font-bold text-blue-700">{item.title}</h3>
          <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{item.content}</p>
        </div>
      ))}
    </div>
  );

  const renderDownloadLink = () => {
    const links = {
      "Constitution of India": {
        href: "/pdfs/constitution.pdf",
        label: "📘 Download Full Constitution PDF",
        color: "bg-green-600 hover:bg-green-700"
      },
      "Indian Penal Code": {
        href: "/pdfs/ipc.pdf",
        label: "📕 Download Full IPC PDF",
        color: "bg-red-600 hover:bg-red-700"
      },
      "Criminal Procedure Code": {
        href: "/pdfs/criminal.pdf",
        label: "📗 Download Full CrPC PDF",
        color: "bg-blue-600 hover:bg-blue-700"
      }
    };

    const link = links[activeTab];
    if (!link) return null;

    return (
      <div className="mt-6 text-center">
        <a
          href={link.href}
          download
          className={`inline-block px-5 py-2 mt-2 text-white rounded ${link.color}`}
        >
          {link.label}
        </a>
      </div>
    );
  };

  const renderContent = () => {
    if (search.trim() !== "") {
      const results = getFilteredResults();
      return results.length > 0 ? renderList(results) : <p className="text-gray-500">No matching results.</p>;
    }

    if (activeTab === "Overview") {
      return (
        <div className="p-6 bg-yellow-100 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Power of People = Power of Justice</h2>
          <p className="text-gray-700">
            This portal gives complete legal awareness to students: Constitution, IPC (especially rape-related laws),
            and CrPC forms related to women’s protection. Use the search box or tabs below.
          </p>
        </div>
      );
    }

    const dataMap = {
      "Constitution of India": constitutionArticles,
      "Indian Penal Code": ipcSections,
      "Criminal Procedure Code": crpcSections
    };

    return (
      <>
        {renderList(dataMap[activeTab])}
        {renderDownloadLink()}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
      <StuNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-4 text-blue-800">
          Know Your Rights – Powered by People
        </h1>

        <div className="sticky top-0 z-20 bg-gray-50 pb-4 pt-2">
          <div className="flex justify-center gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearch("");
                }}
                className={`px-4 py-2 rounded text-sm font-semibold border ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 max-w-xl mx-auto px-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none"
              placeholder="🔍 Search by keyword like 'rape', 'disrobe', 'form 37'..."
            />
          </div>
        </div>

        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
}
