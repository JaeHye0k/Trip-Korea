import { styled } from "styled-components";

export const Wrapper = styled.div`
	width: 100%;
	max-width: 500px;
	margin: 0 auto;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	span {
		display: block;
		text-align: center;
		margin-top: 20px;
		a {
			color: #ff9900;
		}
	}
`;

export const Logo = styled.div`
	width: 100%;
	max-width: 200px;
	margin: 0 auto 100px;
	cursor: pointer;
	&:hover {
		opacity: 0.5;
	}
`;

export const Form = styled.form`
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	input {
		border: 1px solid #ccc;
		padding: 15px;
		border-radius: 10px;
	}

	input[type="submit"] {
		background: #000;
		color: #fff;
		cursor: pointer;
	}
`;

export const Error = styled.p`
	color: red;
	margin-top: 1rem;
	text-align: center;
`;
