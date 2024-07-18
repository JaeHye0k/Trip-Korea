import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { Form, Logo, Wrapper, Error } from "../styled";
import UserTitle from "../components/UserTitle";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../src/redux/user/auth/authSlice";

const UserSignUp = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "name") setName(value);
		else if (name === "email") setEmail(value);
		else if (name === "password") setPassword(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (name === "" || email === "" || password === "") return;

		try {
			setIsLoading(true);
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			// 아래 구문이 없으면 새로고침시 표시된 이름이 사라짐
			await updateProfile(userCredential.user, {
				displayName: name,
			});
			dispatch(
				setUser({
					email: userCredential.user.email,
					uid: userCredential.user.uid,
					displayName: name,
				})
			);

			navigate("/");
		} catch (e) {
			if (e.code === "auth/email-already-in-use") {
				setError("이 이메일은 이미 사용 중입니다.");
			} else if (e.code === "auth/weak-password") {
				setError("비밀번호는 최소 6자 이상이어야 합니다.");
			} else {
				setError("계정 생성 중 오류가 발생했습니다.");
			}
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Wrapper>
			<Logo onClick={() => navigate("/")}>
				<img src="/img/logo.png" alt="" />
			</Logo>
			<UserTitle title={"회원가입"} />
			<Form action="" onSubmit={handleSubmit}>
				<input
					onChange={handleChange}
					type="text"
					name="name"
					placeholder="닉네임을 입력해주세요."
					required
				/>
				<input
					onChange={handleChange}
					type="email"
					name="email"
					placeholder="이메일을 입력해주세요."
					required
				/>
				<input
					onChange={handleChange}
					type="password"
					name="password"
					placeholder="비밀번호를 입력해주세요."
					required
				/>

				<input
					type="submit"
					value={isLoading ? "회원가입 중입니다.." : "회원가입"}
				/>
			</Form>
			{error && <Error>{error}</Error>}
		</Wrapper>
	);
};

export default UserSignUp;
