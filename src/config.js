var config = {
	mysql: {
		host: 'localhost',
		user: 'pma',
		password: '',
		database: 'Chat2'
	},
	db: {
		chatTags: 'Chat_Tags',
		chatTheme: 'Chat_Theme',
		chatRole: 'ChatRole',
		chatRooms: 'ChatRooms',
		chats: 'Chats',
		chatTaskStatus: 'ChatTaskStatus',
		files: 'Files',
		messages: 'Messages',
		messagesStatus: 'MessagesStatus',
		mStatus: 'MStatus',
		spaceRole: 'SpaceRole',
		spaces: 'Spaces',
		spaceUsers: 'SpaceUsers',
		tags: 'Tags',
		users: 'Users'
	},
	ports: {
		http: 3000
	}
}

module.exports = config;