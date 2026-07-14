export function chatEmotesIconHtml() {
  return '<span data-btfw-icon-slot="chat-emotes" aria-hidden="true"><i class="fa fa-smile"></i></span>';
}

export function chatGifIconHtml() {
  return '<i class="fa-solid fa-gif"></i>';
}

export function chatGifIconSlotHtml() {
  return '<span data-btfw-icon-slot="chat-gif" aria-hidden="true"><i class="fa fa-file-video-o"></i></span>';
}

export function chatUsersIconHtml() {
  return '<span data-btfw-icon-slot="chat-users" aria-hidden="true"><i class="fa fa-users"></i></span>';
}

export function chatTopbarHtml() {
  return `
        <div class="btfw-chat-topbar-left">
          <div class="btfw-chat-title" id="btfw-nowplaying-slot"></div>
        </div>
        <div class="btfw-chat-topbar-actions" id="btfw-chat-topbar-actions"></div>
      `;
}

export function chatUserlistPopoverHtml() {
  return `
      <div class="btfw-pophead">
        <span>Users</span>
        <button class="btfw-popclose" aria-label="Close">&times;</button>
      </div>
      <div class="btfw-popbody"></div>
    `;
}
