"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client" 
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Home, Search } from "lucide-react";
import { Mosaic } from "react-loading-indicators";

type Post = {
  id: string;
  title: string;
  content: any;
  created_at: string;
};

const categories = [
  { label: "Todo", slug: "todo" },
  { label: "Tendencias", slug: "tendencias" },
  { label: "Metodologías", slug: "metodologias" },
  { label: "Tecnología", slug: "tecnologia" },
  { label: "Seguridad", slug: "seguridad" },
];

const carouselImages = ["/carousel_1.webp", "/carousel_2.webp", "/carousel_3.webp"];
const FADE_DURATION = 2000;

const Blog: React.FC = () => {

  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todo");
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content, created_at")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching posts:", error);
      else if (data) setPosts(data);

      setLoading(false);
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    if (prevIndex === null) return;
    const timeout = setTimeout(() => setPrevIndex(null), FADE_DURATION);
    return () => clearTimeout(timeout);
  }, [prevIndex]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const PostContentViewer = ({ content }: { content: any }) => {
    const editor = useEditor({
      editable: false,
      extensions: [StarterKit],
      content,
      immediatelyRender: false,
    });
    if (!editor) return null;
    return <EditorContent editor={editor} />;
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <Mosaic color="#2464ec" size="medium" />
        <p className="mt-4 text-gray-600 text-lg font-semibold">Cargando posts...</p>
      </div>
    );

  return (
    <>
      <header className="relative h-56 sm:h-72 md:h-80 overflow-hidden rounded-t-lg select-none">
        {prevIndex !== null && (
          <img
            key={prevIndex}
            src={carouselImages[prevIndex]}
            alt={`Background carousel ${prevIndex + 1}`}
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{
              opacity: 1,
              animation: `fadeOut ${FADE_DURATION}ms forwards ease-in-out`,
              zIndex: 5,
              pointerEvents: "none",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
            draggable={false}
            loading="lazy"
          />
        )}

        <img
          key={currentIndex}
          src={carouselImages[currentIndex]}
          alt={`Background carousel ${currentIndex + 1}`}
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{
            opacity: 0,
            animation: `fadeIn ${FADE_DURATION}ms forwards ease-in-out`,
            zIndex: 10,
            pointerEvents: "none",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
          draggable={false}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/40 z-20"></div>
        <div className="relative z-30 flex flex-col justify-center items-center h-full px-4 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            <em className="italic font-medium mr-1">Blog UNICI</em>
          </h1>
          <p className="italic mt-2 text-lg max-w-2xl">
            Universidad Internacional del Conocimiento e Investigación
          </p>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes fadeOut {
            from { opacity: 1 }
            to { opacity: 0 }
          }
        `}</style>
      </header>

      <nav className="flex flex-wrap justify-between bg-white p-3 border-b border-gray-300 items-center gap-2 select-none">
        <div className="flex flex-wrap gap-4 items-center">
          <button
            className={`flex items-center gap-1.5 text-base font-medium px-2 py-1.5 rounded ${
              selectedCategory === "todo"
                ? "text-blue-600 font-bold"
                : "text-gray-800 hover:text-blue-500"
            }`}
            onClick={() => setSelectedCategory("todo")}
          >
            <Home size={18} />
            <span className="font-semibold">Todo</span>
          </button>

          {categories
            .filter((cat) => cat.slug !== "todo")
            .map((cat) => (
              <button
                key={cat.slug}
                className={`text-base font-medium px-2 py-1.5 rounded ${
                  selectedCategory === cat.slug
                    ? "text-black font-bold"
                    : "text-gray-800 hover:text-blue-500"
                }`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.label}
              </button>
            ))}
        </div>

        <div className="flex items-center bg-gray-200 rounded-lg max-w-xs w-full overflow-hidden">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent flex-grow px-4 py-2 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button className="bg-blue-700 hover:bg-blue-800 p-2 rounded-r-lg text-white flex items-center justify-center">
            <Search size={28} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg mt-8">
            No se encontraron artículos.
          </p>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden select-none hover:shadow-lg transition-shadow p-4"
            >
              <h2 className="text-xl font-bold text-blue-800 mb-2">{post.title}</h2>
              <div className="prose max-w-none text-gray-800 overflow-auto max-h-48">
                <PostContentViewer content={post.content} />
              </div>
              <footer className="mt-2 pt-2 text-sm text-gray-500 border-t border-gray-200 select-none">
                Publicado el {new Date(post.created_at).toLocaleDateString()}
              </footer>
            </article>
          ))
        )}
      </main>
    </>
  );
};

export default Blog;
