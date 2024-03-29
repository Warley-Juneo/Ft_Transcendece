import { useContext, useEffect, useRef, useState } from "react";

import Phaser from "phaser";
import background from "../../../assets/game/planets/backgrounds/bgSpace2.png";

import planetaAnel from '../../../assets/game/planets/planetaJupter.png';
import planetaFire from '../../../assets/game/planets/planetaFire.png';
import planetaLua from '../../../assets/game/planets/PlanetaLua.png';
import Lua from '../../../assets/game/planets/lua.png';
import planetaTerra from '../../../assets/game/planets/PlanetaTerra.png';
import satelete from '../../../assets/game/planets/satelete.png';
import Base from '../../../assets/game/planets/base.png';

import naveFrente from '../../../assets/game/nave/naveFrente.png';
import naveCostas from '../../../assets/game/nave/naveCostas.png';
import naveDescendo from '../../../assets/game/nave/naveDescendo.png';
import naveLateral from '../../../assets/game/nave/naveLateral.png';
import SettingsStore from "../SettingsStore/SettingsStore";
import SettingsPath from "../SettingsGame/SettingsGame";
import Ranking from "../../Rankingpage/Ranking";
import PageChats from "../../PublicChatsPage/PublicChats";
import DinamicProfile from "../../Profiles/DinamicProfile/DinamicProfile";
import MiniProfile from "../../Profiles/MiniProfile/MiniProfile";
import { UserData } from "../../InitialPage/Contexts/Contexts";
import { ModalConvite } from "./ModalConvite";
import { useNavigate } from "react-router-dom";

export type dataConvite = {
	otherId: string,
	myNickname: string,
}

export default function Game(): JSX.Element {

	let [collisionPnt, setCollisionPnt] = useState<string>('');
	const gameContainerRef = useRef<HTMLDivElement>(null);
	const userData = useContext(UserData).user;
	const [openModalConvite, setOpenModalConvite] = useState<boolean>(false);
	const [dataConvite, setDataConvite] = useState<dataConvite>({} as dataConvite);

	useEffect(() => {
		userData.socket?.on("receiveConvite", (data: dataConvite) => {
			if (data.otherId === userData.id)
				setOpenModalConvite(true);
			setDataConvite(data);
		})
	});

	useEffect(() => {
		if (!gameContainerRef.current) return


		class GameData extends Phaser.Scene {
			nave: Phaser.Physics.Arcade.Sprite
			pntAnel: Phaser.Physics.Arcade.Sprite
			pntFire: Phaser.Physics.Arcade.Sprite
			pntLua: Phaser.Physics.Arcade.Sprite
			luaTerra: Phaser.Physics.Arcade.Sprite
			pntTerra: Phaser.Physics.Arcade.Sprite
			sateleteChat: Phaser.Physics.Arcade.Sprite
			base: Phaser.Physics.Arcade.Sprite
			background: Phaser.GameObjects.Sprite
			constructor() {
				super({ key: 'MyGameScene' });
				this.nave = {} as Phaser.Physics.Arcade.Sprite;
				this.pntAnel = {} as Phaser.Physics.Arcade.Sprite;
				this.pntFire = {} as Phaser.Physics.Arcade.Sprite;
				this.pntLua = {} as Phaser.Physics.Arcade.Sprite;
				this.luaTerra = {} as Phaser.Physics.Arcade.Sprite;
				this.pntTerra = {} as Phaser.Physics.Arcade.Sprite;
				this.sateleteChat = {} as Phaser.Physics.Arcade.Sprite;
				this.base = {} as Phaser.Physics.Arcade.Sprite;
				this.background = {} as Phaser.GameObjects.Sprite;
			}

			calculeScaleNave(valueEixoX: number, valueEixoY: number) {
				let percentageX = (valueEixoX * 100 / this.scale.width) / 1000;
				percentageX *= percentageX > 0.06 ? 2 : 1;
				return percentageX + 0.1;
			}

			handleCollision(planetName: string) {
				if (collisionPnt !== planetName) setCollisionPnt(planetName);
			}

			setupColliders() {
				this.physics.add.collider(this.nave, this.pntTerra, () => this.handleCollision("planetTerra"));
				this.physics.add.collider(this.nave, this.pntLua, () => this.handleCollision("planetLua"));
				this.physics.add.collider(this.nave, this.pntFire, () => this.handleCollision("planetFire"));
				this.physics.add.collider(this.nave, this.pntAnel, () => this.handleCollision("planetAnel"));
				this.physics.add.collider(this.nave, this.sateleteChat, () => this.handleCollision("satelite"));
				this.physics.add.collider(this.nave, this.base, () => this.handleCollision("base"));
				this.physics.add.collider(this.nave, this.luaTerra, () => this.handleCollision("Lua"));
			}

			preload(this: Phaser.Scene) {
				// Carregue suas imagens aqui, se necessário
				this.load.image("background", background);
				this.load.image("planetAnel", planetaAnel);
				this.load.image("planetFire", planetaFire);
				this.load.image("planetLua", planetaLua);
				this.load.image('planetTerra', planetaTerra);
				this.load.image('satelete', satelete);
				this.load.image('base', Base);
				this.load.image('Lua', Lua);

				this.load.image('naveFrente', naveFrente);
				this.load.image('naveCostas', naveCostas);
				this.load.image('naveDescendo', naveDescendo);
				this.load.image('naveLateral', naveLateral);
			}

			resize() {
				const containerWidth = window.innerWidth;
					const containerHeight = window.innerHeight;

					// Redimensionar o plano de fundo
					this.background.setScale(containerWidth / this.background.width, containerHeight / this.background.height);
					this.background.setPosition(containerWidth / 2, containerHeight / 2);

					// Reposicionar todos os elementos na tela
					this.pntTerra.x = containerWidth * 0.6;
					this.pntTerra.y = containerHeight * 0.3;
					this.luaTerra.x = containerWidth * 0.57;
					this.luaTerra.y = containerHeight * 0.25;
					this.pntLua.x = containerWidth * 0.9;
					this.pntLua.y = containerHeight * 0.1;
					this.pntFire.x = containerWidth * 0.1;
					this.pntFire.y = containerHeight * 0.2;
					this.pntAnel.x = containerWidth * 0.9;
					this.pntAnel.y = containerHeight * 0.8;
					this.sateleteChat.x = containerWidth * 0.6;
					this.sateleteChat.y = containerHeight * 0.7;
					this.base.x = containerWidth * 0.1;
					this.base.y = containerHeight * 0.9;

					// Reposicionar a nave no centro da tela
					this.nave.x = containerWidth / 2;
					this.nave.y = containerHeight / 2;
			}

			checkResize() {
				// Adiciona um ouvinte de evento para o redimensionamento da janela
				window.addEventListener('resize', () => {
					this.resize();
				});

			}

			create() {
				const containerWidth = this.scale.width;
				const containerHeight = this.scale.height;

				// added background in the center of the scrren
				this.background = this.add.sprite(containerWidth / 2, containerHeight / 2, "background");
				this.background.setScale(containerWidth / this.background.width, containerHeight / this.background.height); // Redimensiona o fundo para preencher a tela

				// added nave in the center of the scrren
				this.nave = this.physics.add.sprite((containerWidth / 2), (containerHeight / 2), "naveFrente");
				this.nave.setCollideWorldBounds(true); // Define a colisão com os limites do mundo
				this.nave.setScale(this.calculeScaleNave(containerWidth / 2, containerHeight / 2)); // Redimensiona a nave para que ela seja proporcional ao tamanho da tela

				this.pntFire = this.physics.add.sprite((containerWidth * 0.1), (containerHeight * 0.2), "planetFire").setImmovable()
				this.pntLua = this.physics.add.sprite((containerWidth * 0.9), (containerHeight * 0.1), "planetLua").setImmovable()
				this.pntAnel = this.physics.add.sprite((containerWidth * 0.9), (containerHeight * 0.8), "planetAnel").setImmovable()
				this.pntTerra = this.physics.add.sprite((containerWidth * 0.6), (containerHeight * 0.3), "planetTerra").setImmovable()
				this.luaTerra = this.physics.add.sprite((containerWidth * 0.57), (containerHeight * 0.25), "Lua").setImmovable()
				this.sateleteChat = this.physics.add.sprite((containerWidth * 0.6), (containerHeight * 0.7), "satelete").setImmovable()
				this.base = this.physics.add.sprite((containerWidth * 0.1), (containerHeight * 0.9), "base").setImmovable()

				this.base.setScale(0.1)
				this.luaTerra.setScale(0.3)
				this.pntLua.setScale(0.4);
				this.pntTerra.setScale(0.7)
				this.sateleteChat.setScale(0.2)
				this.sateleteChat.setAngle(295)

				this.physics.world.setBounds(0, 0, containerWidth, containerHeight);
				this.setupColliders();
				this.checkResize();
			}

			update() {

				const curso = this.input.keyboard?.createCursorKeys();

				if (!curso) return

				if (curso.down.isDown || curso.left.isDown || curso.right.isDown || curso.up.isDown) {
					const { x, y } = this.nave;
					const inverseSizeX = -(-this.scale.width + x)
					this.nave.setScale(this.calculeScaleNave(inverseSizeX, y));

					if (curso.left.isDown && curso.down.isDown) {
						this.nave.setTexture('naveDescendo');
						this.nave.setFlipX(true);
						this.nave.setVelocityX(-100);
						this.nave.setVelocityY(100);
					}
					else if (curso.right.isDown && curso.down.isDown) {
						this.nave.setTexture('naveDescendo');
						this.nave.setFlipX(false);
						this.nave.setVelocityX(100);
						this.nave.setVelocityY(100);
					}
					else if (curso.up.isDown && curso.left.isDown) {
						this.nave.setTexture('naveCostas');
						this.nave.setFlipX(true);
						this.nave.setVelocityX(-100);
						this.nave.setVelocityY(-100);
					}
					else if (curso.up.isDown && curso.right.isDown) {
						this.nave.setTexture('naveCostas');
						this.nave.setFlipX(false);
						this.nave.setVelocityX(100);
						this.nave.setVelocityY(-100);
					}
					else if (curso.up.isDown) {
						this.nave.setTexture('naveCostas');
						this.nave.setVelocityY(-100);
					}
					else if (curso.down.isDown) {
						this.nave.setTexture('naveFrente');
						this.nave.setVelocityY(100);
					}
					else if (curso.left.isDown) {
						this.nave.setTexture('naveLateral');
						this.nave.setFlipX(true);
						this.nave.setVelocityX(-100);
					}
					else if (curso.right.isDown) {
						this.nave.setTexture('naveLateral');
						this.nave.setFlipX(false);
						this.nave.setVelocityX(100);
					}
				} else { // Se nenhuma tecla de seta estiver pressionada pare a nave
					this.nave.setVelocityY(0);
					this.nave.setVelocityX(0);
				}
			}
		}

		const gameConfig: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: window.innerWidth,
			height: window.innerHeight,
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 0 },
					debug: false,
				}
			},
			scene: GameData,
			scale: {
				mode: Phaser.Scale.RESIZE,
				autoCenter: Phaser.Scale.CENTER_BOTH
			}
		};

		const game = new Phaser.Game(gameConfig);




		// Limpeza quando o componente for desmontado
		return () => {
			game.destroy(true);
		};
	}, []);

	const cssGameContainer: React.CSSProperties = {
		height: '100vh !important',
		width: '100vw !important',
	}

	//Ativando o scoket para iniciar uma partipa
	const navigate = useNavigate()
	useEffect(() => {
		userData.socket?.on('startGame', (data: any) => {
			navigate(`/game/pong/${data.roomID}`)
		})
		return () => {
			userData.socket?.off('starGame')
		}
	}, [userData.socket])


	return (
		<div ref={gameContainerRef} style={cssGameContainer}>
			{collisionPnt === 'planetLua' ? <SettingsStore openSettingsStore={setCollisionPnt} /> : null}
			{collisionPnt === 'planetFire' ? <SettingsPath openSettingsPath={setCollisionPnt} /> : null}
			{collisionPnt === 'planetTerra' ? <MiniProfile showMiniPerfil={setCollisionPnt} /> : null}
			{collisionPnt === 'satelite' ? <PageChats openPageChats={setCollisionPnt} /> : null}
			{collisionPnt === 'base' ? <Ranking openStore={setCollisionPnt} /> : null}
			{collisionPnt === 'Lua' ? <DinamicProfile openDinamicProfile={setCollisionPnt}
				nickName={userData.nickname} id={userData.id} /> : null}
			{openModalConvite ? <ModalConvite setOpenChat={setOpenModalConvite} dataConvite={dataConvite} /> : null}
		</div>
	)
}

//TODO Aidicionar mini perfil do usuario
//Adicionar Ranking
