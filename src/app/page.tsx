"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use the Next.js navigation hook
import Cookie from "js-cookie"; // Import js-cookie to manage cookies
import { getContent } from "@/locales/translation"; // Import translation function

export default function Home() {
  const router = useRouter();
  const [isZoomedOut, setIsZoomedOut] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const [planets, setPlanets] = useState<any[]>([]);
  const [title, setTitle] = useState<string>("Explore the Planets");

  // Function to handle planet selection and zoom-out animation
  const navigateToPlanet = (route: string) => {
    setSelectedPlanet(route);
    setIsZoomedOut(true);
    setTimeout(() => {
      router.push(`/${route}`); // Navigate to the selected planet
    }, 500); // Wait for 500ms for the zoom-out transition
  };

  // Get browser language and store it in a cookie if it doesn't exist
  useEffect(() => {
    // Get the browser's language, e.g., "en-US", "pt-BR", etc.
    const browserLanguage = navigator.language; // Capture the full language (like "pt-BR")
    const languageCode = browserLanguage.split("-")[0]; // Get the language code (e.g., "pt")

    console.log("Detected browser language:", browserLanguage); // Log the full language code
    console.log("Extracted language code:", languageCode); // Log just the language part (e.g., "pt")

    const storedLanguage = Cookie.get("language"); // Get the language cookie

    if (!storedLanguage) {
      // If no language cookie exists, set the browser's language
      Cookie.set("language", languageCode, { expires: 365 }); // Store it for 1 year
      console.log("Language cookie set to:", languageCode); // Log the language that was set
    } else if (storedLanguage !== languageCode) {
      // If the cookie exists but is different from the browser's language, update the cookie
      Cookie.set("language", languageCode, { expires: 365 });
      console.log("Updated language cookie to:", languageCode); // Log the updated language
    } else {
      console.log(
        "Stored language is the same as browser language:",
        storedLanguage
      ); // Log that no update was necessary
    }

    // If there is a stored language (not undefined), get the content
    if (storedLanguage == undefined) return;

    // Fetch the content based on the stored language
    const content = getContent(storedLanguage);

    // Set the planets and title based on the content
    setPlanets(content.menu.planets);
    setTitle(content.menu.title); // Update the title to be localized
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div
      className={`min-h-screen bg-black flex items-center justify-center transition-transform duration-500 ${
        isZoomedOut ? "scale-0" : "scale-100"
      }`}
    >
      <main className="flex flex-col items-center justify-center">
        {/* Title */}
        <h1 className="text-4xl text-white mb-8">{title}</h1>

        {/* Menu with buttons for each planet */}
        <div className="flex flex-col space-y-4">
          {planets.map((planet) => (
            <button
              key={planet.route}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
              onClick={() => navigateToPlanet(planet.route)}
            >
              {planet.name}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
