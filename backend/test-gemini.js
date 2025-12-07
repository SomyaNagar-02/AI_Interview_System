import "dotenv/config";

const API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
  console.log("---------------------------------------------------");
  console.log("🔍 DIAGNOSTIC TOOL");
  
  if (!API_KEY) {
    console.error("❌ CRITICAL: No API Key found in process.env!");
    return;
  }

  // 1. Verify Key Integrity
  console.log(`🔑 Using Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`);
  if (API_KEY.trim() !== API_KEY) {
    console.error("⚠️ WARNING: Your API Key has hidden spaces at the start or end! Check your .env file.");
  }

  // 2. Direct HTTP Request (Bypassing SDK)
  console.log("\n📡 Pinging Google API directly to list models...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY.trim()}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      console.log("✅ SUCCESS! Connection Established.");
      console.log("📜 Available Models for this Key:");
      const modelNames = data.models.map(m => m.name.replace("models/", ""));
      console.log(modelNames.join(", "));
      
      console.log("\n👇 USE THIS IN YOUR CODE:");
      console.log(`const model = genAI.getGenerativeModel({ model: "${modelNames.includes('gemini-1.5-flash') ? 'gemini-1.5-flash' : 'gemini-pro'}" });`);
    } else {
      console.error(`\n❌ API ERROR: ${response.status} ${response.statusText}`);
      console.error("👇 ERROR DETAILS:");
      console.error(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("\n❌ NETWORK ERROR:", error.message);
  }
  console.log("---------------------------------------------------");
}

checkModels();