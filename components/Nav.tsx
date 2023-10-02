import { SessionData } from "lib/commonTypes.ts"

export function Nav(data: SessionData) {
  return (
    <nav class="container-fluid">
      <ul>
        <li>
          <a href="./" class="contrast">
            <strong>WebTrace</strong>
          </a>        
        </li>
      </ul>
      <ul>  
      {data.isAuthed && /* If we are logged in, present menu */      
          <li>
            <details role="list" dir="rtl">
              <summary aria-haspopup="listbox" role="link" class="secondary">
              <img src={data.avatar} class="user-avatar" alt="the GitHub user avatar"/>
              </summary>
              <ul role="listbox">
                <li>
                  <a href="#">Settings</a>
                  <a href="/logout">Logout {data.userName}</a>                  
                </li>
              </ul>
            </details>
          </li>
        }    
        <li>
          <details role="list" dir="rtl">
            <summary aria-haspopup="listbox" role="link" class="secondary">
            <img src="/img/svg/yin-yang-filled.svg" class="icon" alt="dark/light mode selector"/>
            </summary>
            <ul role="listbox">
              <li>
                <a href="#" data-theme-switcher="auto">Auto</a>
              </li>
              <li>
                <a href="#" data-theme-switcher="light">Light mode</a>
              </li>
              <li>
                <a href="#" data-theme-switcher="dark">Dark mode</a>
              </li>
            </ul>
          </details>
        </li>        
      </ul>
    </nav>
  );
}
