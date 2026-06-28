import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function Reviews() {
  const router = useRouter();
  const { targetId, targetType } = router.query;
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [replyText, setReplyText] = useState<{[key: string]: string}>({});
  const [photo, setPhoto] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("User"); 

  useEffect(() => {
    if (!targetId) return;
    setUserId(localStorage.getItem("userId"));
    setUserName(localStorage.getItem("userName") || "User");
    fetch(`${BACKEND}/review/get/${targetId}?sortBy=${sortBy}`)
      .then(r => r.json())
      .then(setReviews);
  }, [targetId, sortBy]);

  const submitReview = async () => {
    if (!rating || !comment) return alert("Please give rating and comment");
    await fetch(`${BACKEND}/review/add?userId=${userId}&userName=${userName}&targetId=${targetId}&targetType=${targetType}&rating=${rating}&comment=${encodeURIComponent(comment)}&photoUrl=${encodeURIComponent(photo)}`, { method: "POST" });
    setComment("");
    setRating(0);
    fetch(`${BACKEND}/review/get/${targetId}?sortBy=${sortBy}`).then(r => r.json()).then(setReviews);
  };

  const submitReply = async (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text) return;
    await fetch(`${BACKEND}/review/reply/${reviewId}?userId=${userId}&userName=${userName}&comment=${encodeURIComponent(text)}`, { method: "POST" });
    setReplyText(prev => ({ ...prev, [reviewId]: "" }));
    fetch(`${BACKEND}/review/get/${targetId}?sortBy=${sortBy}`).then(r => r.json()).then(setReviews);
  };

  const markHelpful = async (reviewId: string) => {
    await fetch(`${BACKEND}/review/helpful/${reviewId}`, { method: "POST" });
    fetch(`${BACKEND}/review/get/${targetId}?sortBy=${sortBy}`).then(r => r.json()).then(setReviews);
  };

  const flagReview = async (reviewId: string) => {
    await fetch(`${BACKEND}/review/flag/${reviewId}`, { method: "POST" });
    fetch(`${BACKEND}/review/get/${targetId}?sortBy=${sortBy}`).then(r => r.json()).then(setReviews);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reviews for {targetType}</h1>

      {/* Sort Filter */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setSortBy("newest")} className={`px-3 py-1 rounded text-sm ${sortBy === "newest" ? "bg-blue-600 text-white" : "border"}`}>Newest</button>
        <button onClick={() => setSortBy("highest")} className={`px-3 py-1 rounded text-sm ${sortBy === "highest" ? "bg-blue-600 text-white" : "border"}`}>Highest Rated</button>
        <button onClick={() => setSortBy("helpful")} className={`px-3 py-1 rounded text-sm ${sortBy === "helpful" ? "bg-blue-600 text-white" : "border"}`}>Most Helpful</button>
      </div>

      {/* Write Review */}
      <div className="bg-white shadow rounded-xl p-4 mb-6">
        <h2 className="font-semibold mb-2">Write a Review</h2>
        <div className="flex gap-1 mb-2">
          {[1,2,3,4,5].map(s => (
            <span key={s} onClick={() => setRating(s)} className={`text-2xl cursor-pointer ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write your review..." className="w-full border rounded p-2 text-sm mb-2" rows={3} />
        <div className="mb-2">
        <label className="text-sm text-gray-600">Upload Photo (optional)</label>
        <input type="file" accept="image/*" onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
           const reader = new FileReader();
           reader.onloadend = () => setPhoto(reader.result as string);
           reader.readAsDataURL(file);
           setPhotoName(file.name);
         }
       }} className="w-full border rounded p-1 text-sm mt-1" />
      {photo && <img src={photo} alt="preview" className="mt-2 h-24 rounded" />}
       </div> 
      <button onClick={submitReview} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Submit Review</button>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 && <p className="text-gray-400">No reviews yet.</p>}
      {reviews.map((r, i) => (
        <div key={i} className="bg-white shadow rounded-xl p-4 mb-4">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{r.userName}</p>
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-lg ${s <= r.rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400">{r.createdAt?.slice(0,10)}</p>
          </div>
          <p className="text-sm mt-2">{r.comment}</p>
          {r.photoUrl && <img src={r.photoUrl} alt="review photo" className="mt-2 h-32 rounded" />}

          <div className="flex gap-3 mt-2">
            <button onClick={() => markHelpful(r.id)} className="text-xs text-blue-600">👍 Helpful ({r.helpfulCount})</button>
            <button onClick={() => flagReview(r.id)} className="text-xs text-red-500">🚩 Flag</button>
          </div>

          {/* Replies */}
          {r.replies?.map((rep: any, j: number) => (
            <div key={j} className="ml-4 mt-2 bg-gray-50 rounded p-2">
              <p className="text-xs font-semibold">{rep.userName}</p>
              <p className="text-xs">{rep.comment}</p>
            </div>
          ))}

          {/* Reply box */}
          <div className="mt-2 flex gap-2">
            <input value={replyText[r.id] || ""} onChange={e => setReplyText(prev => ({...prev, [r.id]: e.target.value}))} placeholder="Write a reply..." className="flex-1 border rounded px-2 py-1 text-xs" />
            <button onClick={() => submitReply(r.id)} className="px-3 py-1 bg-gray-200 rounded text-xs">Reply</button>
          </div>
        </div>
      ))}
    </div>
  );
}