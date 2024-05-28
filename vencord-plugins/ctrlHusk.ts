/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { addClickListener, removeClickListener } from "@api/MessageEvents";
import definePlugin, { OptionType } from "@utils/types";
import { UserStore, GuildChannelStore } from "@webpack/common";

let isControlPressed = false;
const keydown = (e: KeyboardEvent) => e.key === "Control" && (isControlPressed = true);
const keyup = (e: KeyboardEvent) => e.key === "Control" && (isControlPressed = false);
export default definePlugin({
    name: "ctrlHusk",
    description: "Hold control while clicking on a message to husk it. Must be in the vencord server. Works globally with nitro.",
    authors: [{name:"dwnas", id:589322754470445057n}],
    dependencies: ["MessageEventsAPI"],

    start() {
        document.addEventListener("keydown", keydown);
        document.addEventListener("keyup", keyup)

        this.onClick = addClickListener((msg: any, channel, event) => {
            if (isControlPressed) {

                const vencordChannels = GuildChannelStore.getChannels('1015060230222131221')
                let isInVencord = false

                vencordChannels["SELECTABLE"].forEach(element => {
                    if (element.channel.id == msg.channel_id) {
                        isInVencord = true
                    }
                });

                vencordChannels["VOCAL"].forEach(element => {
                    if (element.channel.id == msg.channel_id) {
                        isInVencord = true
                    }
                });

                const hasNitro = UserStore.getCurrentUser().premiumType

                if ((hasNitro && hasNitro > 0) || (isInVencord)) {
                    Vencord.Webpack.findByProps("addReaction").addReaction(msg.channel_id, msg.id, {id: '1026532993923293184', name: 'husk', animated: false});
                    event.preventDefault();
                }

            }
        });
    },

    stop() {
        removeClickListener(this.onClick);
        document.removeEventListener("keydown", keydown);
        document.removeEventListener("keyup", keyup);
    }
});
