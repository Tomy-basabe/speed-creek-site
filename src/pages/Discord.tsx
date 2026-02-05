import { useState } from "react";
import { useDiscord } from "@/hooks/useDiscord";
import { useAuth } from "@/contexts/AuthContext";
import { DiscordServerList } from "@/components/discord/DiscordServerList";
import { DiscordChannelSidebar } from "@/components/discord/DiscordChannelSidebar";
import { DiscordTextChannel } from "@/components/discord/DiscordTextChannel";
import { DiscordVoiceChannel } from "@/components/discord/DiscordVoiceChannel";
import { DiscordVoiceBar } from "@/components/discord/DiscordVoiceBar";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Discord() {
  const discord = useDiscord();
  const { user } = useAuth();
  const [showMembers, setShowMembers] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-[#313338] overflow-hidden">
      {/* Server list - Discord style vertical bar */}
      <DiscordServerList
        servers={discord.servers}
        currentServer={discord.currentServer}
        onSelectServer={discord.setCurrentServer}
        onCreateServer={discord.createServer}
      />

      {/* Channel sidebar - collapsible */}
      {discord.currentServer && (
        <div className={cn(
          "transition-all duration-300 relative",
          sidebarCollapsed ? "w-0 overflow-hidden" : "w-60"
        )}>
          <DiscordChannelSidebar
            server={discord.currentServer}
            channels={discord.channels}
            currentChannel={discord.currentChannel}
            members={discord.members}
            voiceParticipants={discord.voiceParticipants}
            speakingUsers={discord.speakingUsers}
            onSelectChannel={(channel) => {
              if (channel.type === "voice") {
                if (discord.inVoiceChannel && discord.currentChannel?.id === channel.id) {
                  // Already in this channel
                  return;
                }
                if (discord.inVoiceChannel) {
                  discord.leaveVoiceChannel();
                }
                discord.joinVoiceChannel(channel);
              } else {
                discord.setCurrentChannel(channel);
              }
            }}
            onCreateChannel={discord.createChannel}
            onDeleteChannel={discord.deleteChannel}
            onInviteUser={discord.inviteUser}
            inVoiceChannel={discord.inVoiceChannel}
            currentVoiceChannel={discord.inVoiceChannel ? discord.currentChannel : null}
          />
        </div>
      )}

      {/* Sidebar toggle button */}
      {discord.currentServer && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "absolute z-50 bg-[#2b2d31] hover:bg-[#35373c] text-[#b5bac1] hover:text-white border border-[#1f2023] rounded-full w-6 h-6 transition-all duration-300",
                sidebarCollapsed ? "left-[72px]" : "left-[calc(72px+240px-12px)]",
                "top-4"
              )}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {sidebarCollapsed ? "Mostrar canales" : "Ocultar canales"}
          </TooltipContent>
        </Tooltip>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {discord.currentChannel ? (
          discord.currentChannel.type === "text" ? (
            <DiscordTextChannel
              channel={discord.currentChannel}
              messages={discord.messages}
              onSendMessage={discord.sendMessage}
              showMembers={showMembers}
              onToggleMembers={() => setShowMembers(!showMembers)}
              members={discord.members}
            />
          ) : (
            <DiscordVoiceChannel
              channel={discord.currentChannel}
              participants={discord.voiceParticipants}
              localStream={discord.localStream}
              remoteStreams={discord.remoteStreams}
              speakingUsers={discord.speakingUsers}
              isVideoEnabled={discord.isVideoEnabled}
              isAudioEnabled={discord.isAudioEnabled}
              isScreenSharing={discord.isScreenSharing}
              localUserId={user?.id ?? null}
            />
          )
        ) : discord.currentServer ? (
          <div className="flex-1 flex items-center justify-center text-[#949ba4]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">¡Bienvenido a {discord.currentServer.name}!</h2>
              <p>Selecciona un canal para comenzar</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#949ba4]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Discord</h2>
              <p>Selecciona o crea un servidor para comenzar</p>
            </div>
          </div>
        )}

        {/* Voice control bar - shows when in voice channel */}
        {discord.inVoiceChannel && (
          <DiscordVoiceBar
            channel={discord.currentChannel}
            isAudioEnabled={discord.isAudioEnabled}
            isVideoEnabled={discord.isVideoEnabled}
            isScreenSharing={discord.isScreenSharing}
            onToggleAudio={discord.toggleAudio}
            onToggleVideo={discord.toggleVideo}
            onToggleScreenShare={() => {
              if (discord.isScreenSharing) {
                discord.stopScreenShare();
              } else {
                discord.startScreenShare();
              }
            }}
            onLeave={discord.leaveVoiceChannel}
          />
        )}
      </div>
    </div>
  );
}
