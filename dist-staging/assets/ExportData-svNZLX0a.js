import{j as e,m as O}from"./vendor-framer-zsrQx7cT.js";import{r as j}from"./vendor-react-D3d-6vLx.js";import{u as P,F as c,C as r}from"./feature-admin-CeioLUoe.js";import{u as T}from"./index-Dlvy7Clg.js";import{a4 as z,B,ap as f,b as L,d as F,o as I,C as G,aq as A,ar as J}from"./feature-auth-CVL30ZLg.js";import"./vendor-recharts-L6AoX9bA.js";const U=[{format:"json",label:"JSON",description:"Full data backup, great for importing later",icon:e.jsx(f,{className:"w-6 h-6"})},{format:"csv",label:"CSV Spreadsheet",description:"Open in Excel or Google Sheets",icon:e.jsx(A,{className:"w-6 h-6"})},{format:"pdf",label:"PDF Report",description:"Beautiful printable reading report",icon:e.jsx(J,{className:"w-6 h-6"})}],H=()=>{const{books:x,poems:g,blogPosts:v,readingStats:y}=P(),{stats:l,level:d,totalXP:N,unlockedAchievements:h}=T(),[w,m]=j.useState(null),[R,u]=j.useState([]),S=()=>{const a={exportDate:new Date().toISOString(),version:"1.0",books:x,poems:g,blogPosts:v,readingStats:y,gamification:{level:d.level,levelTitle:d.title,totalXP:N,achievements:h,stats:l}};return JSON.stringify(a,null,2)},k=()=>{const a=["Title","Author","Genre","Pages","Rating","Date Read","Notes"],s=x.filter(t=>t.isRead).map(t=>[`"${t.title.replace(/"/g,'""')}"`,`"${t.author.replace(/"/g,'""')}"`,t.genre,t.pageCount||"",t.rating||"",t.dateRead||"",`"${(t.notes||"").replace(/"/g,'""')}"`]);return[a.join(","),...s.map(t=>t.join(","))].join(`
`)},$=()=>{const a=x.filter(s=>s.isRead);return`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reading Report</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px; }
            h2 { color: #4c1d95; margin-top: 30px; }
            .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
            .stat { background: #f3e8ff; padding: 20px; border-radius: 12px; text-align: center; }
            .stat-value { font-size: 2em; font-weight: bold; color: #7c3aed; }
            .stat-label { color: #6b7280; font-size: 0.9em; }
            .book { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .book-title { font-weight: bold; font-size: 1.1em; }
            .book-author { color: #6b7280; }
            .book-rating { color: #f59e0b; }
            .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 0.8em; }
          </style>
        </head>
        <body>
          <h1>My Reading Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-value">${l.booksRead}</div>
              <div class="stat-label">Books Read</div>
            </div>
            <div class="stat">
              <div class="stat-value">${l.pagesRead.toLocaleString()}</div>
              <div class="stat-label">Pages Read</div>
            </div>
            <div class="stat">
              <div class="stat-value">Level ${d.level}</div>
              <div class="stat-label">${d.title}</div>
            </div>
          </div>
          
          <h2>Books I've Read (${a.length})</h2>
          ${a.map(s=>`
            <div class="book">
              <div class="book-title">${s.title}</div>
              <div class="book-author">by ${s.author}</div>
              ${s.rating?`<div class="book-rating">${"★".repeat(s.rating)}${"☆".repeat(5-s.rating)}</div>`:""}
              ${s.dateRead?`<div>Read: ${new Date(s.dateRead).toLocaleDateString()}</div>`:""}
            </div>
          `).join("")}
          
          <div class="footer">
            <p>Izzy Reads - Reading is an Adventure!</p>
          </div>
        </body>
      </html>
    `},D=async a=>{m(a),await new Promise(i=>setTimeout(i,1e3));let s,t,p;switch(a){case"json":s=S(),t=`izzy-reads-backup-${new Date().toISOString().split("T")[0]}.json`,p="application/json";break;case"csv":s=k(),t=`izzy-reads-books-${new Date().toISOString().split("T")[0]}.csv`,p="text/csv";break;case"pdf":{const i=$(),o=window.open("","_blank");o&&(o.document.write(i),o.document.close(),o.print()),m(null),u(E=>[...E,a]);return}default:return}const C=new Blob([s],{type:p}),b=URL.createObjectURL(C),n=document.createElement("a");n.href=b,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(b),m(null),u(i=>[...i,a])};return e.jsxs("div",{className:"space-y-6",children:[e.jsx(c,{children:e.jsx(r,{variant:"gradient",padding:"lg",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center",children:e.jsx(z,{className:"w-8 h-8 text-blue-600"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-display font-bold text-gray-900",children:"Export Your Data"}),e.jsx("p",{className:"text-gray-600",children:"Download your reading history and statistics"})]})]})})}),e.jsx(c,{delay:.1,children:e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4",children:[e.jsxs(r,{padding:"md",className:"text-center",children:[e.jsx(B,{className:"w-6 h-6 text-blue-500 mx-auto mb-2"}),e.jsx("p",{className:"text-2xl font-bold text-gray-900",children:l.booksRead}),e.jsx("p",{className:"text-sm text-gray-500",children:"Books"})]}),e.jsxs(r,{padding:"md",className:"text-center",children:[e.jsx(f,{className:"w-6 h-6 text-purple-500 mx-auto mb-2"}),e.jsx("p",{className:"text-2xl font-bold text-gray-900",children:g.length}),e.jsx("p",{className:"text-sm text-gray-500",children:"Poems"})]}),e.jsxs(r,{padding:"md",className:"text-center",children:[e.jsx(L,{className:"w-6 h-6 text-amber-500 mx-auto mb-2"}),e.jsx("p",{className:"text-2xl font-bold text-gray-900",children:h.length}),e.jsx("p",{className:"text-sm text-gray-500",children:"Achievements"})]}),e.jsxs(r,{padding:"md",className:"text-center",children:[e.jsx(F,{className:"w-6 h-6 text-green-500 mx-auto mb-2"}),e.jsx("p",{className:"text-2xl font-bold text-gray-900",children:l.streakWeeks}),e.jsx("p",{className:"text-sm text-gray-500",children:"Week Streak"})]})]})}),e.jsxs(c,{delay:.2,children:[e.jsx("h2",{className:"text-xl font-display font-bold text-gray-900 mb-4",children:"Choose Export Format"}),e.jsx("div",{className:"grid md:grid-cols-3 gap-4",children:U.map(a=>{const s=w===a.format,t=R.includes(a.format);return e.jsxs(O.button,{onClick:()=>D(a.format),disabled:s,className:`p-6 rounded-2xl border-2 transition-all text-left ${t?"border-green-400 bg-green-50":"border-gray-200 hover:border-purple-300 hover:bg-purple-50"}`,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsxs("div",{className:"flex items-start justify-between mb-4",children:[e.jsx("div",{className:`w-12 h-12 rounded-xl flex items-center justify-center ${t?"bg-green-100 text-green-600":"bg-gray-100 text-gray-600"}`,children:s?e.jsx(I,{className:"w-6 h-6 animate-spin"}):t?e.jsx(G,{className:"w-6 h-6"}):a.icon}),t&&e.jsx("span",{className:"text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full",children:"Downloaded"})]}),e.jsx("h3",{className:"font-bold text-gray-900 mb-1",children:a.label}),e.jsx("p",{className:"text-sm text-gray-500",children:a.description})]},a.format)})})]}),e.jsx(c,{delay:.3,children:e.jsxs(r,{padding:"lg",className:"bg-gradient-to-r from-blue-50 to-purple-50",children:[e.jsx("h3",{className:"font-bold text-gray-900 mb-3",children:"Export Tips"}),e.jsxs("ul",{className:"space-y-2 text-sm text-gray-600",children:[e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-blue-500 mt-0.5",children:"•"}),e.jsxs("span",{children:[e.jsx("strong",{children:"JSON:"})," Best for backing up all your data. You can import this later!"]})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-purple-500 mt-0.5",children:"•"}),e.jsxs("span",{children:[e.jsx("strong",{children:"CSV:"})," Perfect for analyzing your reading in a spreadsheet app."]})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-pink-500 mt-0.5",children:"•"}),e.jsxs("span",{children:[e.jsx("strong",{children:"PDF:"})," Great for printing or sharing your reading achievements!"]})]})]})]})})]})};export{H as default};
