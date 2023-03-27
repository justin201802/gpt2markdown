// start
const rootEle = document.querySelector('div[id="__next"]');
let innerText = document.querySelector('a[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 bg-gray-800 hover:bg-gray-800 group"]')?.innerText;

// let expoButton = document.createElement('button');

// expoButton.classList.add('gpt2markdown-export', 'font-medium', 'ml-1', 'md:ml-0', 'mt-0', 'md:mt-3', 'flex', 'items-center', 'justify-center', 'gap-2', 'text-sm', 'rounded-md', 'py-2', 'px-3', 'btn-primary')
// expoButton.innerHTML = `
//     <span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-export" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
//     <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//     <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
//     <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3"></path>
//     </svg></span>
//     <span>GPT 2 Markdown</span>
//     `;
// inputActionNode = document.querySelector("div[class*='relative flex h-full flex-1 md:flex-col']");
// inputActionNode.appendChild(expoButton)
// expoButton.addEventListener('click', handleClick);
// expoButton.addEventListener('load', () => console.log(document.querySelector(".pr-14.bg-gray-800")?.innerText))

new MutationObserver(() => {
    handleStore();
}).observe(rootEle, {
    childList: true,
    subtree: true
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if(request.action == "save"){
        handleClick();
    }
    sendResponse({farewell: "Goodbye from content script"});
  });

function handleClick() {
    if (document.querySelector(".pr-14.bg-gray-800")?.innerText === undefined) return
    // handleLiveChat()

    const e = document.querySelectorAll(".text-base");
    let t = "";
    for (const s of e) {
        if (s.querySelector('.whitespace-pre-wrap')) {

            let innerHtml = s.querySelector(".whitespace-pre-wrap").innerHTML;
            t += `${html2md(s.querySelectorAll('img').length > 1 ? `**You:**` : `**ChatGPT:**`)}\n${html2md(innerHtml)}\n\n --------\n`
        }
    }
    const o = document.createElement("a");
    let d = new Date()
    date = d.toISOString()
    o.download = (`${date} • ${document.querySelector(".pr-14.bg-gray-800")?.innerText}` || "Conversation with ChatGPT") + ".md", o.href = URL.createObjectURL(new Blob([t])), o.style.display = "none", document.body.appendChild(o), o.click()
}

function handleStore() {
    textarea = document.querySelector('textarea')
    if (!textarea) return

    existingButton = document.querySelector('.gpt2markdown-export')
    existingFooter = document.querySelector("div[class*='absolute bottom-0']");
    // if (!existingButton || !existingFooter) {
    //     expoButton.classList.add('gpt2markdown-export', 'font-medium', 'ml-1', 'md:ml-0', 'mt-0', 'md:mt-3', 'flex', 'items-center', 'justify-center', 'gap-2', 'text-sm', 'rounded-md', 'py-2', 'px-3', 'btn-primary')
    //     expoButton.innerHTML = `
    //         <span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-export" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    //         <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    //         <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
    //         <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3"></path>
    //         </svg></span>
    //         <span>GPT 2 Markdown</span>
    // `;
    //     inputActionNode = document.querySelector("div[class*='relative flex h-full flex-1 md:flex-col']");
    //     inputActionNode.appendChild(expoButton)
    //     expoButton.addEventListener('click', handleClick);
    // }
}

function cleanHeading1(text) {
    // remove any double quotation marks from the text - sometimes ChatGPT be adding "" quote marks
    return text.replace(/"/g, "");
}

function htmlToMarkdown(html) {
    let markdown = html;
    markdown = markdown.replace(/<\/?div[^>]*>/g, '');
    markdown = markdown.replace(/<br[^>]*>/g, '\n');

    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
    markdown = markdown.replace(/<u>(.*?)<\/u>/g, '__$1__');
    markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
    markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n');
    markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, '#### $1\n');
    markdown = markdown.replace(/<h5>(.*?)<\/h5>/g, '##### $1\n');
    markdown = markdown.replace(/<h6>(.*?)<\/h6>/g, '###### $1\n');
    markdown = markdown.replace(/<code class="[^"]*">/g, '\n'); // remove code tags
    markdown = markdown.replace(/<\/code>/g, ''); // remove pre tags
    markdown = markdown.replace(/<pre><span class="">(.*?)<\/span>/g, '<pre>$1\n'); // remove language tag portion
    markdown = markdown.replace(/<pre>/g, '```'); // replace pre tags with code blocks
    markdown = markdown.replace(/<\/pre>/g, '\n```\n'); // replace pre tags with code blocks
    markdown = markdown.replace(/<button class="flex ml-auto gap-2">(.*?)<\/button>/g, ''); // Remove copy button SVG
    markdown = markdown.replace(/<span class="[^"]*">|<\/span>/g, ''); // Remove span tags
    markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n');

    const unorderedRegex = /<ul>(.*?)<\/ul>/gs;
    let match;
    let indent = 0;
    while ((match = unorderedRegex.exec(markdown))) {
        const list = match[1];
        const items = list.split('<li>');
        let itemStr = '';
        items.forEach((item, i) => {
            if (i === 0) return;
            item = item.replace('</li>', '');
            if (item.indexOf('<ul>') !== -1) {
                indent++;
            }
            itemStr += `${'  '.repeat(indent)}* ${item}`;
            if (item.indexOf('</ul>') !== -1) {
                indent--;
            }
        });
        markdown = markdown.replace(match[0], `${itemStr}`);
    }

    const orderedRegex = /<ol.*?>(.*?)<\/ol>/gs;
    const orderedLists = markdown.match(orderedRegex);
    if (orderedLists) {
        orderedLists.forEach((orderedList) => {
            let mdOrderedList = '';
            const listItems = orderedList.match(/<li.*?>(.*?)<\/li>/g);
            if (listItems) {
                listItems.forEach((listItem, index) => {
                    if (listItem.indexOf('<ul>') !== -1) {
                        indent++;
                    }
                    mdOrderedList += `${'  '.repeat(indent)}${index + 1
                        }. ${listItem.replace(/<li.*?>(.*?)<\/li>/g, '$1\n')}`;
                    if (listItem.indexOf('</ul>') !== -1) {
                        indent--;
                    }
                });
            }
            markdown = markdown.replace(orderedList, mdOrderedList);
        });
    }

    markdown = markdown.replace(/<ul>(.*?)<\/ul>/gs, function (match, p1) {
        return (
            '\n' +
            p1.replace(/<li>(.*?)<\/li>/g, function (match, p2) {
                return '\n- ' + p2;
            })
        );
    });
    const tableRegex = /<table>.*?<\/table>/g;
    const tableRowRegex = /<tr>.*?<\/tr>/g;
    const tableHeaderRegex = /<th.*?>(.*?)<\/th>/g;
    const tableDataRegex = /<td.*?>(.*?)<\/td>/g;

    const tables = html.match(tableRegex);
    if (tables) {
        tables.forEach((table) => {
            let markdownTable = '\n';
            const rows = table.match(tableRowRegex);
            if (rows) {
                rows.forEach((row) => {
                    let markdownRow = '\n';
                    const headers = row.match(tableHeaderRegex);
                    if (headers) {
                        headers.forEach((header) => {
                            markdownRow += `| ${header.replace(tableHeaderRegex, '$1')} `;
                        });
                        markdownRow += '|\n';
                        markdownRow += '| --- '.repeat(headers.length) + '|';
                    }
                    const data = row.match(tableDataRegex);
                    if (data) {
                        data.forEach((d) => {
                            markdownRow += `| ${d.replace(tableDataRegex, '$1')} `;
                        });
                        markdownRow += '|';
                    }
                    markdownTable += markdownRow;
                });
            }
            markdown = markdown.replace(table, markdownTable);
        });
    }
    return markdown;
}

/**
 * 把 html 内容转化为 markdown 格式 V1.0
 * 
 * @author kohunglee
 * @param {string} htmlData 转换前的 html 
 * @return {string} 转化后的 markdown 源码
 */
function html2md(htmlData){
    codeContent     = new Array  // code标签数据
    preContent      = new Array  // pre标签数据
    tableContent    = new Array  // table标签数据
    olContent       = new Array  // ol标签数据
    imgContent      = new Array  // img标签数据
    aContent        = new Array  // a标签数据
    let pureHtml    = htmlData

    // 源代码
    // console.log("转换前的源码：" + pureHtml)

    // 函数：删去html标签
    function clearHtmlTag(sourceData = ''){  
        return sourceData.replace(/\<[\s\S]*?\>/g,'')
    }

    // 复原ol标签
    function olRecover(olData = ''){  
        let result = olData
        let num = olData.match(/\<li\>/ig).length
        for(let i = 1; i <= num; i++){
            let line = '[~wrap]'
            if(i == 1) line = '[~wrap][~wrap]'
            result = result.replace(/\<li\>/i, line + i + '. ')
        }
        result = result.replace(/\<\/li\>/, '')
        return result
    }

    // 函数：复原img标签
    function imgRecover(imgHtml = ''){  
        let imgSrc,imgTit,imgAlt,result
        imgSrc     = imgHtml.match(/(?<=src=['"])[\s\S]*?(?=['"])/i)
        imgTit     = imgHtml.match(/(?<=title=['"])[\s\S]*?(?=['"])/i)
        imgAlt     = imgHtml.match(/(?<=alt=['"])[\s\S]*?(?=['"])/i)

        imgTit = (imgTit != null) ? ` "${imgTit}"` : ' '
        imgAlt = (imgAlt != 'null') ? imgAlt : " "
        result = `![${imgAlt}](${imgSrc}${imgTit})`
        return result
    }

    // 函数：复原a标签
    function aRecover(aData = ''){  
        let aHref = '' + aData.match(/(?<=href=['"])[\s\S]*?(?=['"])/i)
        let aTit  = '' + aData.match(/(?<=title=['"])[\s\S]*?(?=['"])/i)
        let aText = '' + aData.match(/(?<=\<a\s*[^\>]*?\>)[\s\S]*?(?=<\/a>)/i)

        let aImg = aData.match(/<img\s*[^\>]*?\>[^]*?(<\/img>)?/i)
        let aImgSrc,aImgTit,aImgAlt

        aTit = (aTit != 'null') ? ` "${aTit}"` : ' '
        aText = clearHtmlTag(aText)
        let result = `[${aText}](${aHref}${aTit})`
        
        if(aImg != null){  // 函数：如果发现图片,则更换为图片显示模式
            aImgSrc     = aImg[0].match(/(?<=src=['"])[\s\S]*?(?=['"])/i)
            aImgTit     = aImg[0].match(/(?<=title=['"])[\s\S]*?(?=['"])/i)
            aImgAlt     = aImg[0].match(/(?<=alt=['"])[\s\S]*?(?=['"])/i)

            aImgTit = (aImgTit != null) ? ` "${aImgTit}"` : ' '
            aImgAlt = (aImgAlt != 'null') ? aImgAlt : " "
            result = `[![${aImgAlt}](${aImgSrc}${aImgTit})](${aHref}${aTit})`
        }
        return result
    }

    // 函数：复原table标签
    function tableRecover(tableData = null){  
        if(tableData[0] == null){  // 如果不存在 th 标签，则默认表格为一层
            let result = ''
            let colNum = tableData[1].length

            for(let i = 0; i < colNum; i++){
            result += `|${clearHtmlTag(tableData[1][i])}`
            }
            result += `|[~wrap]`
            for(let j = 0; j < colNum; j++){
                result += `| :------------: `
            }
            result += `|[~wrap]`
            return result
        }
        let colNum = tableData[0].length  // 如果存在 th 标签，则按 th 的格数来构建整个表格
        let result = ''

        for(let i = 0; i < colNum; i++){
            result += `|${clearHtmlTag(tableData[0][i])}`
        }
        result += `|[~wrap]`
        for(let j = 0; j < colNum; j++){
            result += `| :------------: `
        }
        result += `|[~wrap]`
        for(let k = 0; k < tableData[1].length;){
            for(let z = 0; z < colNum; z++,k++){
                result += `|${clearHtmlTag(tableData[1][k])}`
            }
            result += `|[~wrap]`
        }
        return result+`[~wrap]`
    }
    // 去掉样式和脚本极其内容
    pureHtml = pureHtml.replace(/<style\s*[^\>]*?\>[^]*?<\/style>/ig,'').replace(/<script\s*[^\>]*?\>[^]*?<\/script>/ig,'')
    
    pureHtml = pureHtml.replace(/<button class="flex ml-auto gap-2">(.*?)<\/button>/g, ''); // Remove copy button SVG
    
    pureHtml = pureHtml.replace(/(<pre>.*?)(<span>[^<]+?<\/span>)(.+?<code)/g, '$1$3'); // remove language tag portion
    // pureHtml = pureHtml.replace(/<pre><span class="">(.*?)<\/span>/g, '<pre>$1\n'); // remove language tag portion
    // pureHtml = pureHtml.replace(/<span class="[^"]*">|<\/span>/g, ''); // Remove span tags
    // pureHtml = pureHtml.replace(/<span>|<\/span>/g, ''); // Remove span tags with no class

    // 储存pre的内容,并替换<pre>中的内容
    preContent = pureHtml.match(/<pre\s*[^\>]*?\>[^]*?<\/pre>/ig)
    // console.log(preContent);
    
    pureHtml = pureHtml.replace(/(?<=\<pre\s*[^\>]*?\>)[\s\S]*?(?=<\/pre>)/ig,'`#preContent#`')

    // 储存code的内容,并替换<code>中的内容
    codeContent = pureHtml.match(/(?<=\<code\s*[^\>]*?\>)[\s\S]*?(?=<\/code>)/ig)
    pureHtml = pureHtml.replace(/(?<=\<code\s*[^\>]*?\>)[\s\S]*?(?=<\/code>)/ig,'`#codeContent#`')

    // 储存a的内容,并替换<a>中的内容
    aContent = pureHtml.match(/<a\s*[^\>]*?\>[^]*?<\/a>/ig)
    pureHtml = pureHtml.replace(/<a\s*[^\>]*?\>[^]*?<\/a>/ig,'`#aContent#`')

    // 储存img的内容,并替换<img>中的内容
    imgContent = pureHtml.match(/<img\s*[^\>]*?\>[^]*?(<\/img>)?/ig)
    pureHtml = pureHtml.replace(/<img\s*[^\>]*?\>[^]*?(<\/img>)?/ig,'`#imgContent#`')

    // 获取纯净（无属性）的 html
    pureHtml = pureHtml.replace(/(?<=\<[a-zA-Z0-9]*)\s.*?(?=\>)/g,'')  

    // 标题：标获取<h1><h2>...数据,并替换
    pureHtml = pureHtml.replace(/<h1>/ig,'[~wrap]# ').replace(/<\/h1>/ig,'[~wrap][~wrap]')
                        .replace(/<h2>/ig,'[~wrap]## ').replace(/<\/h2>/ig,'[~wrap][~wrap]')
                        .replace(/<h3>/ig,'[~wrap]### ').replace(/<\/h3>/ig,'[~wrap][~wrap]')
                        .replace(/<h4>/ig,'[~wrap]#### ').replace(/<\/h4>/ig,'[~wrap][~wrap]')
                        .replace(/<h5>/ig,'[~wrap]##### ').replace(/<\/h5>/ig,'[~wrap][~wrap]')
                        .replace(/<h6>/ig,'[~wrap]###### ').replace(/<\/h6>/ig,'[~wrap][~wrap]')

    // 段落：处理一些常用的结构标签
    pureHtml = pureHtml.replace(/(<br>)/ig,'[~wrap]').replace(/(<\/p>)|(<br\/>)|(<\/div>)/ig,'[~wrap][~wrap]')
                       .replace(/(<meta>)|(<span>)|(<p>)|(<div>)/ig,'').replace(/<\/span>/ig,'')

    // 粗体：替换<b><strong>
    pureHtml = pureHtml.replace(/(<b>)|(<strong>)/ig,'**').replace(/(<\/b>)|(<\/strong>)/ig,'**')

    // 斜体：替换<i><em><abbr><dfn><cite><address>
    pureHtml = pureHtml.replace(/(<i>)|(<em>)|(<abbr>)|(<dfn>)|(<cite>)|(<address>)/ig,'*').replace(/(<\/i>)|(<\/em>)|(<\/abbr>)|(<\/dfn>)|(<\/cite>)|(<\/address>)/ig,'*')

    // 删除线：替换<del>
    pureHtml = pureHtml.replace(/\<del\>/ig,'~~').replace(/\<\/del\>/ig,'~~')

    // 引用：替换<blockquote>
    pureHtml = pureHtml.replace(/\<blockquote\>/ig,'[~wrap][~wrap]> ').replace(/\<\/blockquote\>/ig,'[~wrap][~wrap]')

    // 水平线：替换<hr>
    pureHtml = pureHtml.replace(/\<hr\>/ig,'[~wrap][~wrap]------[~wrap][~wrap]')

    // 表格 <table>,得到数据,删除标签，然后逐层分析储存,最终根据结果生成
    tableContent = pureHtml.match(/(?<=\<table\s*[^\>]*?\>)[\s\S]*?(?=<\/table>)/ig)
    pureHtml = pureHtml.replace(/<table\s*[^\>]*?\>[^]*?<\/table>/ig,'`#tableContent#`')
    if(tableContent !== null){  // 分析储存
        tbodyContent = new Array
        for(let i = 0; i < tableContent.length; i++){
            tbodyContent[i] = new Array  // tbodyContent[i]的第一个数据是thead数据,第二个是tbody的数据
            tbodyContent[i].push(tableContent[i].match(/(?<=\<th>)[\s\S]*?(?=<\/th?>)/ig))
            tbodyContent[i].push(tableContent[i].match(/(?<=\<td>)[\s\S]*?(?=<\/td?>)/ig))
        }
    }
    if(typeof tbodyContent !== "undefined"){  // 替换
        for(let i = 0; i < tbodyContent.length; i++){
            let tableText = tableRecover(tbodyContent[i])
            pureHtml = pureHtml.replace(/\`\#tableContent\#\`/i,tableText)
        }
    }
    
    // 有序列表<ol>的<li>,储存ol的内容,并循环恢复ol中的内容
    olContent = pureHtml.match(/(?<=\<ol\s*[^\>]*?\>)[\s\S]*?(?=<\/ol>)/ig)
    pureHtml = pureHtml.replace(/(?<=\<ol\s*[^\>]*?\>)[\s\S]*?(?=<\/ol>)/ig,'`#olContent#`')
    if(olContent !== null){
        for(let k = 0; k < olContent.length; k++){
            let olText = olRecover(olContent[k])
            pureHtml = pureHtml.replace(/\`\#olContent\#\`/i,clearHtmlTag(olText))
        }
    }

    // 无序列表<ul>的<li>，以及<dd>,直接替换
    pureHtml = pureHtml.replace(/(<li>)|(<dd>)/ig,'[~wrap] - ').replace(/(<\/li>)|(<\/dd>)/ig,'[~wrap][~wrap]')

    // 处理完列表后，将 <lu>、<\lu>、<ol>、<\ol> 处理
    pureHtml = pureHtml.replace(/(<ul>)|(<ol>)/ig,'').replace(/(<\/ul>)|(<\/ol>)/ig,'[~wrap][~wrap]')

    // 先恢复 img ,再恢复 a
    if(imgContent !== null){
        for(let i = 0; i < imgContent.length; i++){
            let imgText = imgRecover(imgContent[i])
            pureHtml = pureHtml.replace(/\`\#imgContent\#\`/i,imgText)
        }
    }

    // 恢复 a
    if(aContent !== null){
        for(let k = 0; k < aContent.length; k++){
            let aText = aRecover(aContent[k])
            pureHtml = pureHtml.replace(/\`\#aContent\#\`/i,aText)
        }
    }

    // 换行处理，1.替换 [~wrap] 为 ‘\n’   2.首行换行删去。   3.将其他过长的换行删去。
    pureHtml = pureHtml.replace(/\[\~wrap\]/ig,'\n')
                       .replace(/\n{3,}/g,'\n\n')

    // 代码 <code> ,根据上面的数组恢复code,然后将code替换
    if(codeContent !== null){
        for(let i = 0; i < codeContent.length; i++){
            pureHtml = pureHtml.replace(/\`\#codeContent\#\`/i,clearHtmlTag(codeContent[i]))
        }
    }
    pureHtml = pureHtml.replace(/\<code\>/ig,' ` ').replace(/\<\/code\>/ig,' ` ')

    // 代码 <pre> ,恢复pre,然后将pre替换
    if(preContent !== null){
        for(let k = 0; k < preContent.length; k++){
            let preLanguage = preContent[k].match(/(?<=language-).*?(?=[\s'"])/i)
            let preText = clearHtmlTag(preContent[k])
            preText = preText.replace(/^1\n2\n(\d+\n)*/,'')  // 去掉行数

            preLanguage = (preLanguage != null && preLanguage[0] != 'undefined') ? preLanguage[0] + '\n' : '\n'
            pureHtml = pureHtml.replace(/\`\#preContent\#\`/i,preLanguage + preText)
        }
    }
    pureHtml = pureHtml.replace(/\<pre\>/ig,'```').replace(/\<\/pre\>/ig,'\n```\n')

    // 删去其余的html标签，还原预文本代码中的 '<' 和 '>'
    pureHtml = clearHtmlTag(pureHtml)
    pureHtml = pureHtml.replace(/\&lt\;/ig,'<').replace(/\&gt\;/ig,'>')

    // 删去头部的空行
    pureHtml = pureHtml.replace(/^\n{1,}/i,'')

    return pureHtml
}
// end